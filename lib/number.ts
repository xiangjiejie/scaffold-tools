type PieData = {
  item: string;
  count: number;
  percent: number;
  [key: string]: string | number;
};

/** 百分比相加为100的优化法
 * arr: 原数据
 * total：总和
 * off：误差
 */
export const piePercent = (arr: PieData[]): PieData[] => {
  // 计算总和
  const total = arr.reduce((total: number, current: PieData) => {
    return total + current.count;
  }, 0);
  if (total === 0) {
    return zeroAveragePercent(arr);
  }
  const result = [] as PieData[];
  let floorTotal = 0;
  let off = 0;
  // 向下取整后算差异
  arr.forEach((item) => {
    item.percent = (item.count * 100) / total;
    // 两位小数点，向下取
    floorTotal += Math.floor(item.percent * 100);
  });
  off = (10000 - floorTotal) / 100; // 误差 * 100

  // 按照小数点部分降序排序
  arr.sort((a, b) => {
    return (
      b.percent - Math.floor(b.percent) - (a.percent - Math.floor(a.percent))
    );
  });

  arr.forEach((item: PieData) => {
    if (off > 0) {
      result.push({
        ...item,
        percent: (Math.floor(item.percent * 100) + 1) / 10000,
      });
      off--;
    } else {
      result.push({
        ...item,
        percent: Math.floor(item.percent * 100) / 10000,
      });
    }
  });

  return result;
};

/** 总和为零的情况下，均分百分比 */
export const zeroAveragePercent = <T = unknown>(arr: T[]): T[] => {
  const percent = +(1 / arr.length).toFixed(4);

  return arr.map((item: T, index: number) => {
    if (index === arr.length - 1) {
      return {
        ...item,
        percent: (100 - percent * index * 100) / 100,
      };
    }
    return {
      ...item,
      percent: percent,
    };
  });
};
