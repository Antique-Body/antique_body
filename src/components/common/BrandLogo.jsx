export const BrandLogo = ({
  logoTitle = "ANTIQUE BODY",
  logoTagline = "",
  className = "",
  titleStyle = {},
  containerStyle = {},
  firstWordColor = "#ff7800",
  secondWordColor = "#ffffff",
  size = "default", // "small", "default", "large"
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return {
          fontSize: "1rem",
          lineHeight: "1.2",
        };
      case "large":
        return {
          fontSize: "2rem",
          lineHeight: "1.1",
        };
      default:
        return {
          fontSize: "1.5rem",
          lineHeight: "1.2",
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <div
      className={`logo ${className}`}
      style={{
        marginBottom: "0",
        ...containerStyle,
      }}
    >
      <h1
        style={{
          marginTop: "0",
          marginBottom: logoTagline.length > 0 ? "4px" : "0",
          fontWeight: "bold",
          letterSpacing: "0.02em",
          ...sizeStyles,
          ...titleStyle,
        }}
      >
        {logoTitle.split(" ").map((part, index) => (
          <span
            key={index}
            style={{
              color: index === 0 ? firstWordColor : secondWordColor,
              marginRight:
                index < logoTitle.split(" ").length - 1 ? "0.25em" : "0",
            }}
          >
            {part}
          </span>
        ))}
      </h1>
      {logoTagline.length > 0 && (
        <div
          className="logo-tagline"
          style={{
            fontSize: `${parseFloat(sizeStyles.fontSize) * 0.6}rem`,
            color: "#999",
            marginTop: "2px",
          }}
        >
          {logoTagline}
        </div>
      )}
    </div>
  );
};
