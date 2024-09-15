import React from "react";

// Utility function to generate a random color
const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

interface FilterProps {
  name: string;
  icon?: React.ReactNode;
}

export interface TableProps {
  title: string;
  columns: TableColumn[];
  data: TableRow[];
  rowUrl?: string;
  filters?: FilterProps[];
}

export interface TableColumn {
  key: string;
  title: string;
  width: string;
}

export interface TableRow {
  [key: string]: string | React.ReactNode;
}

export default function Table({ columns, data }: TableProps) {
  return (
    <div className="w-full">
      <table className="w-full border-collapse mt-6 rounded-lg overflow-hidden shadow-lg">
        <thead>
          <tr className="bg-[#1F1F2E] text-gray-300">
            {columns.map((column, index) => (
              <th
                key={index}
                className={`${column.width} text-left py-3 px-6 font-semibold text-sm tracking-wide border-b border-gray-700`}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              className={`hover:bg-[#2A2A3C] transition duration-150 ${
                index % 2 === 0 ? "bg-[#232331]" : "bg-[#1F1F2E]"
              }`}
            >
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className={`px-6 py-4 text-sm text-gray-400 border-b border-gray-700 ${column.width}`}
                >
                  {column.key === "name" ? (
                    <div className="flex items-center gap-2">
                      <div
                        className="w-5 h-5 rounded-full"
                        style={{ backgroundColor: getRandomColor() }}
                      />
                      <span className="text-gray-200 font-medium">
                        {row[column.key]}
                      </span>
                    </div>
                  ) : (
                    <span>{row[column.key]}</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
