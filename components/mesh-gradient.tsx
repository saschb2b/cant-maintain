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
          "radial-gradient(ellipse 80% 60% at 10% 20%, rgba(var(--mui-palette-primary-mainChannel) /0.18) 0%, transparent 100%)",
          "radial-gradient(ellipse 70% 50% at 90% 15%, rgba(var(--mui-palette-success-mainChannel) /0.16) 0%, transparent 100%)",
          "radial-gradient(ellipse 60% 50% at 5% 70%, rgba(var(--mui-palette-warning-mainChannel) /0.13) 0%, transparent 100%)",
          "radial-gradient(ellipse 70% 60% at 85% 75%, rgba(var(--mui-palette-primary-mainChannel) /0.10) 0%, transparent 100%)",
          "radial-gradient(circle at 50% 50%, rgba(var(--mui-palette-error-mainChannel) /0.05) 0%, transparent 70%)",
        ].join(", "),
      }}
    />
  );
}
