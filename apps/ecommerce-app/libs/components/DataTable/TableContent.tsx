import { useDataTableContext } from './DataTableContext';

export function TableContent() {
  const datatable = useDataTableContext();
  return (
    <div className="overflow-x-scroll whitespace-nowrap">
      <div className="flex py-3 px-3">
        <p className="text-[18px] font-medium text-carbon-300">
          Product Details
        </p>
      </div>
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-carbon-900">
            {datatable.table.columns.map((column) => {
              return (
                <th
                  key={column.heading}
                  className="px-4 py-3 text-left text-carbon-500 font-semibold"
                >
                  {column.heading}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {datatable.table.collections?.items?.map((item, rowIdx) => {
            return (
              <tr key={rowIdx} className="border-b border-carbon-900/50">
                {datatable.table.columns.map((column) => {
                  return (
                    <td key={column.heading} className="px-4 py-3">
                      {column.render(item)}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
