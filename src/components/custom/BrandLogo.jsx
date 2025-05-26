export const BrandLogo = ({ logoTitle = "ANTIQUE BODY", logoTagline = "" }) => {
    return (
        <div className="logo" style={{ marginBottom: "15px" }}>
            <h1 style={{ marginTop: "0", marginBottom: "6px" }}>
                {logoTitle.split(" ").map((part, index) => (
                    <span
                        key={index}
                        style={{
                            color: index === 0 ? "#ff7800" : "#ffffff",
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
};
