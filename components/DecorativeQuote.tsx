const ORANGE = "#E07B39";

export default function DecorativeQuote({ text }: { text: string }) {
  return (
    <div style={{
      position: "relative",
      maxWidth: 540,
      margin: "0 auto",
      padding: "8px 36px 20px",
    }}>
      <span aria-hidden="true" style={{
        position: "absolute",
        top: -10,
        left: 0,
        fontFamily: "Georgia, 'Times New Roman', serif",
        fontWeight: "bold",
        fontSize: 52,
        lineHeight: 1,
        color: ORANGE,
        userSelect: "none",
      }}>&ldquo;</span>

      <p style={{
        margin: 0,
        textAlign: "center",
        fontSize: 14,
        lineHeight: 1.65,
        color: "#111",
        fontWeight: 600,
      }}>
        {text}
      </p>

      <span aria-hidden="true" style={{
        position: "absolute",
        bottom: -8,
        right: 0,
        fontFamily: "Georgia, 'Times New Roman', serif",
        fontWeight: "bold",
        fontSize: 52,
        lineHeight: 1,
        color: ORANGE,
        userSelect: "none",
      }}>&rdquo;</span>
    </div>
  );
}
