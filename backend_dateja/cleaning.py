import logging

import numpy as np
import pandas as pd
from fuzzywuzzy import fuzz
from sklearn.decomposition import PCA
from sklearn.feature_selection import RFE, mutual_info_regression

logger = logging.getLogger(__name__)


class AdvancedDataPipeline:
    def __init__(self, df):
        self.df = df
        self.original_df = df.copy()
        self.metadata = None
        self.numeric_cols = self.df.select_dtypes(include=[np.number]).columns
        self.categorical_cols = self.df.select_dtypes(
            include=["object", "category"]
        ).columns
        self.datetime_cols = self.df.select_dtypes(include=["datetime64"]).columns

    def handle_inconsistent_formats(self):
        try:
            logger.info("Handling inconsistent formats...")
            for col in self.df.columns:
                if self.df[col].dtype == "object":
                    # Strip whitespace
                    self.df[col] = self.df[col].str.strip()

                    # Remove special characters except for commas, periods, and spaces
                    self.df[col] = self.df[col].str.replace(
                        r"[^\w\s,.]", "", regex=True
                    )

                    # Remove extra spaces
                    self.df[col] = self.df[col].str.replace(r"\s+", " ", regex=True)
            return (
                self.df,
                None,
                "Handled inconsistent formats by removing special characters (except commas and periods) from text columns.",
            )
        except Exception as e:
            logger.error(f"Error in handle_inconsistent_formats: {str(e)}")
            logger.exception(e)
            return self.df, f"Error handling inconsistent formats: {str(e)}", None

    def handle_missing_values(self):
        try:
            for column in self.df.columns:
                if self.df[column].dtype == object:
                    self.df[column] = self.df[column].fillna("").astype(str)
                elif pd.api.types.is_numeric_dtype(self.df[column]):
                    self.df[column] = (
                        self.df[column].fillna(self.df[column].median()).round(2)
                    )
                elif pd.api.types.is_datetime64_any_dtype(self.df[column]):
                    self.df[column] = self.df[column].fillna(
                        self.df[column].mode()[0]
                        if not self.df[column].mode().empty
                        else pd.NaT
                    )
                elif self.df[column].dtype == bool:
                    self.df[column] = self.df[column].fillna(False)
            return self.df, None, "Handled missing values in all columns."
        except Exception as e:
            logger.error(f"Error in handle_missing_values: {str(e)}")
            logger.exception(e)
            return self.df, f"Error handling missing values: {str(e)}", None

    def handle_duplicates(self, similarity_threshold=80):
        try:
            logger.info("Handling duplicates including near-duplicates...")
            initial_rows = len(self.df)

            # Drop exact duplicates
            self.df.drop_duplicates(inplace=True)

            # Check for near-duplicates only if there are enough rows to make it meaningful
            if len(self.df) < 2:
                return (
                    self.df,
                    None,
                    "Not enough data to check for near-duplicates after removing exact duplicates.",
                )

            # Identify and remove near-duplicates
            def calculate_similarity(row1, row2):
                return np.mean([fuzz.ratio(str(a), str(b)) for a, b in zip(row1, row2)])

            rows_to_remove = set()
            for i in range(len(self.df)):
                if i in rows_to_remove:
                    continue
                for j in range(i + 1, len(self.df)):
                    if j in rows_to_remove:
                        continue
                    similarity = calculate_similarity(self.df.iloc[i], self.df.iloc[j])
                    if similarity > similarity_threshold:
                        rows_to_remove.add(j)

            self.df = self.df.drop(index=rows_to_remove)

            rows_removed = initial_rows - len(self.df)
            logger.info(f"Removed {rows_removed} duplicate and near-duplicate rows")

            return (
                self.df,
                None,
                f"Removed {rows_removed} duplicate and near-duplicate rows.",
            )
        except Exception as e:
            logger.error(f"Error in handle_duplicates: {str(e)}")
            logger.exception(e)
            return self.df, f"Error handling duplicates: {str(e)}", None

    def handle_high_dimensionality(self):
        try:
            logger.info("Handling high dimensionality...")
            numeric_columns = self.df.select_dtypes(include=[np.number]).columns

            if len(numeric_columns) <= 1:
                return (
                    self.df,
                    None,
                    "Not enough numeric columns for dimensionality reduction.",
                )

            pca = PCA(n_components=0.95)
            pca_result = pca.fit_transform(self.df[numeric_columns])
            pca_df = pd.DataFrame(
                data=pca_result,
                columns=[f"PC_{i+1}" for i in range(pca_result.shape[1])],
            )

            mi_scores = mutual_info_regression(
                self.df[numeric_columns], self.df[self.df.columns[-1]]
            )
            mi_scores = pd.Series(mi_scores, name="MI Scores", index=numeric_columns)
            top_features = mi_scores.nlargest(10).index.tolist()

            self.df = pd.concat([self.df, pca_df], axis=1)
            self.df = self.df[
                [
                    col
                    for col in self.df.columns
                    if col in top_features or col.startswith("PC_")
                ]
            ]

            return (
                self.df,
                None,
                f"Reduced dimensions from {len(numeric_columns)} to {len(self.df.columns)} columns.",
            )
        except Exception as e:
            logger.error(f"Error in handle_high_dimensionality: {str(e)}")
            logger.exception(e)
            return self.df, f"Error handling high dimensionality: {str(e)}", None

    def handle_request(self, action):
        if action == "handle_inconsistent_formats":
            return self.handle_inconsistent_formats()
        elif action == "handle_missing_values":
            return self.handle_missing_values()
        elif action == "handle_duplicates":
            return self.handle_duplicates()
        elif action == "handle_high_dimensionality":
            return self.handle_high_dimensionality()
        else:
            return self.df, "Invalid action.", None
