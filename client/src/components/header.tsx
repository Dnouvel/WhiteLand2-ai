import { Search, Map, Menu, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "./theme-toggle";
import { useState } from "react";

interface HeaderProps {
  onSearch?: (query: string) => void;
  onToggleSidebar?: () => void;
}

export function Header({ onSearch, onToggleSidebar }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="flex h-full items-center justify-between gap-4 px-4">
        {/* Left - Logo and mobile menu */}
        <div className="flex items-center gap-3">
          <Button 
            size="icon" 
            variant="ghost" 
            className="md:hidden"
            onClick={onToggleSidebar}
            data-testid="button-mobile-menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <a 
            href="https://www.whiteland.ai" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2"
            data-testid="link-logo"
          >
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
              <Map className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg hidden sm:inline">WhiteLand.AI</span>
          </a>
        </div>

        {/* Center - Search */}
        <form onSubmit={handleSubmit} className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by address or parcel number..."
              className="pl-9 pr-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search"
            />
          </div>
        </form>

        {/* Right - Actions */}
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            asChild
            data-testid="button-home"
          >
            <a href="https://www.whiteland.ai" target="_blank" rel="noopener noreferrer">
              <Home className="h-5 w-5" />
            </a>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
