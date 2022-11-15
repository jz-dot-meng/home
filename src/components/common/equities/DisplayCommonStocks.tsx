import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ReduxRootState } from "../../../redux/store";

//styling
import styles from "./DisplayCommonStocks.module.css";

type DisplayCommonStocksProps = {
  overlappingHoldings: number;
  commonStocks: string[];
};

export const DisplayCommonStocks: React.FunctionComponent<
  DisplayCommonStocksProps
> = ({ ...props }) => {
  const { overlappingHoldings, commonStocks } = props;
  const overlaps = useSelector(
    (state: ReduxRootState) => state.equities.etfOverlap.overlap
  );
  const etfHoldings = useSelector(
    (state: ReduxRootState) => state.equities.etfOverlap.etfHoldings
  );

  const [etfsWithOverlap, setEtfsWithOverlap] = useState<string[]>([]);

  useEffect(() => {
    const etfWithO: string[] = [];
    Object.keys(etfHoldings).forEach((etfTicker) => {
      let hasOverlappingStocking: boolean = false;
      commonStocks.forEach((stock) => {
        if (
          etfHoldings[etfTicker]
            .map((holding) => holding.ticker)
            .indexOf(stock) !== -1
        ) {
          hasOverlappingStocking = true;
        }
      });
      if (hasOverlappingStocking) {
        etfWithO.push(etfTicker);
      }
    });
    setEtfsWithOverlap(etfWithO);
  }, [commonStocks]);
  return (
    <>
      {overlappingHoldings > 0 ? (
        <>
          <table className={styles.displayCommonTable}>
            <thead>
              <tr>
                <th>Overlapping holdings</th>
                {etfsWithOverlap.map((etfTicker) => (
                  <th
                    className={styles.displayCommonHeaderFontlight}
                    key={etfTicker}
                  >
                    {" "}
                    Weighting in {etfTicker}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {commonStocks.map((stock, index) => {
                return (
                  <tr
                    key={overlaps[stock].name}
                    className={
                      index % 2 == 0 ? styles.displayCommonTableRowAlt : ""
                    }
                  >
                    <td className={styles.displayCommonStockName}>
                      {overlaps[stock].name}
                    </td>
                    {etfsWithOverlap.map((etfTicker) => {
                      if (!overlaps[stock].etfs[etfTicker]) {
                        return (
                          <td
                            key={`${overlaps[stock].name}-${etfTicker}-weight`}
                          ></td>
                        );
                      } else {
                        return (
                          <td
                            className={styles.displayCommonWeighting}
                            key={`${overlaps[stock].name}-${etfTicker}-weight`}
                          >
                            {(overlaps[stock].etfs[etfTicker] * 100).toFixed(2)}
                            %
                          </td>
                        );
                      }
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      ) : (
        <></>
      )}
    </>
  );
};
