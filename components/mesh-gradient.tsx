import Box from "@mui/material/Box";

/** Fixed-position mesh gradient backdrop shared across pages. */
export function MeshGradient() {
  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        background: [
          "radial-gradient(ellipse 80% 60% at 10% 20%, rgba(43,76,126,0.18) 0%, transparent 100%)",
          "radial-gradient(ellipse 70% 50% at 90% 15%, rgba(91,138,114,0.16) 0%, transparent 100%)",
          "radial-gradient(ellipse 60% 50% at 5% 70%, rgba(212,135,60,0.13) 0%, transparent 100%)",
          "radial-gradient(ellipse 70% 60% at 85% 75%, rgba(43,76,126,0.10) 0%, transparent 100%)",
          "radial-gradient(circle at 50% 50%, rgba(196,87,58,0.05) 0%, transparent 70%)",
        ].join(", "),
      }}
    />
  );
}
