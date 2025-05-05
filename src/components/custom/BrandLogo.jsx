export const BrandLogo = ({
    logoTitle = "ANTIQUE BODY",
    logoTagline = "",
    className = "",
    titleClassName = "",
    firstWordColor = "#ff7800",
    secondWordColor = "#ffffff",
    titleStyle = {},
    containerStyle = {},
}) => (
    <div className={`logo ${className}`} style={{ ...containerStyle }}>
        <h1 style={{ marginTop: "0", marginBottom: "6px", fontSize: "1.7rem", fontWeight: "700", ...titleStyle }}>
            {logoTitle.split(" ").map((part, index) => (
                <span
                    key={index}
                    className={titleClassName}
                    style={{
                        color: index === 0 ? firstWordColor : secondWordColor,
                        marginRight: "4px",
                    }}
                >
                    {part}
                </span>
            ))}
        </h1>
        {logoTagline.length > 0 && <div className="logo-tagline">{logoTagline}</div>}
    </div>
);
