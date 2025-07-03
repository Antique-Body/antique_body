export const BrandLogo = ({
  logoTitle = "ANTIQUE BODY",
  logoTagline = "",
  className = "",
  titleStyle = {},
  containerStyle = {},
  firstWordColor = "#ff7800",
  secondWordColor = "#ffffff",
}) => (
  <div
    className={`logo ${className}`}
    style={{
      marginBottom: "15px",
      ...containerStyle,
    }}
  >
    <h1
      style={{
        marginTop: "0",
        marginBottom: "6px",
        ...titleStyle,
      }}
    >
      {logoTitle.split(" ").map((part, index) => (
        <span
          key={index}
          style={{
            color: index === 0 ? firstWordColor : secondWordColor,
            marginRight: "4px",
          }}
        >
          {part}
        </span>
      ))}
    </h1>
    {logoTagline.length > 0 && (
      <div className="logo-tagline">{logoTagline}</div>
    )}
  </div>
);
