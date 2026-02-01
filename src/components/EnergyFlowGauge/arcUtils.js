export const getArcPath = (
  center,
  radius,
  startAngle,
  endAngle
) => {
  const start = {
    x: center + radius * Math.cos((startAngle - 90) * Math.PI / 180),
    y: center + radius * Math.sin((startAngle - 90) * Math.PI / 180)
  };

  const end = {
    x: center + radius * Math.cos((endAngle - 90) * Math.PI / 180),
    y: center + radius * Math.sin((endAngle - 90) * Math.PI / 180)
  };

  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
};
