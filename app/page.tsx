import { Game } from "@/components/game/game";
import { Code2, Github } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Code2 className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-lg font-bold font-sans text-foreground leading-tight">
                {"Can't Maintain"}
              </h1>
              <p className="text-xs text-muted-foreground font-mono">
                Can you spot the better props?
              </p>
            </div>
          </div>
          <a
            href="https://react.dev/learn/passing-props-to-a-component"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            <Github className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">React Docs</span>
          </a>
        </div>
      </header>

      {/* Game area */}
      <section className="px-4 py-8">
        <Game />
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>
            A training game for React prop naming conventions and JSDoc documentation.
          </p>
          <p className="font-mono">
            {/* Show challenge count for maintainer reference */}
            Built for junior devs with love
          </p>
        </div>
      </footer>
    </main>
  );
}
