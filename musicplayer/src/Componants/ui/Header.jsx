import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Icon from "../AppIcon";
import Button from "./Button";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigationItems = [
    { name: "Player", path: "/music-player-interface", icon: "Play" },
    { name: "Library", path: "/library", icon: "Music" },
    { name: "Playlists", path: "/playlists", icon: "ListMusic" },
    { name: "Discover", path: "/discover", icon: "Compass" },
  ];

  const secondaryItems = [
    { name: "Settings", path: "/settings", icon: "Settings" },
    { name: "Help", path: "/help", icon: "HelpCircle" },
  ];

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  const handleNavigation = (path) => {
    window.location.href = path;
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "glass shadow-elevation-2"
          : "bg-background/80 backdrop-blur-sm"
      }`}
    >
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow">
              <Icon name="Music" size={20} color="white" />
            </div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-secondary animate-pulse opacity-50"></div>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold text-foreground font-sans">
              Circular Music
            </h1>
            <p className="text-xs text-muted-foreground font-mono">Player</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigationItems?.map((item) => (
            <button
              key={item?.name}
              onClick={() => handleNavigation(item?.path)}
              className={`relative px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 group ${
                isActivePath(item?.path)
                  ? "bg-primary/20 text-primary shadow-glow"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface/50"
              }`}
            >
              <Icon
                name={item?.icon}
                size={18}
                className={`transition-colors duration-300 ${
                  isActivePath(item?.path)
                    ? "text-primary"
                    : "group-hover:text-foreground"
                }`}
              />
              <span className="font-medium">{item?.name}</span>
              {isActivePath(item?.path) && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></div>
              )}
            </button>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-3">
          {/* Search */}
          <Button
            variant="ghost"
            size="icon"
            className="relative ripple-effect"
            onClick={() => {}}
          >
            <Icon name="Search" size={20} />
          </Button>

          {/* More Menu */}
          <div className="relative group">
            <Button
              variant="ghost"
              size="icon"
              className="relative ripple-effect"
            >
              <Icon name="MoreHorizontal" size={20} />
            </Button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-2 w-48 glass rounded-lg shadow-elevation-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <div className="py-2">
                {secondaryItems?.map((item) => (
                  <button
                    key={item?.name}
                    onClick={() => handleNavigation(item?.path)}
                    className="w-full px-4 py-2 text-left text-muted-foreground hover:text-foreground hover:bg-surface/50 transition-colors duration-200 flex items-center space-x-3"
                  >
                    <Icon name={item?.icon} size={16} />
                    <span>{item?.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* User Profile */}
          <Button
            variant="ghost"
            size="icon"
            className="relative ripple-effect"
            onClick={() => {}}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
              <Icon name="User" size={16} color="white" />
            </div>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden ripple-effect"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={24} />
        </Button>
      </div>
      {/* Mobile Menu */}
      <div
        className={`md:hidden glass border-t border-border/50 transition-all duration-300 ${
          isMobileMenuOpen
            ? "max-h-96 opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="px-6 py-4 space-y-2">
          {/* Primary Navigation */}
          {navigationItems?.map((item) => (
            <button
              key={item?.name}
              onClick={() => handleNavigation(item?.path)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                isActivePath(item?.path)
                  ? "bg-primary/20 text-primary shadow-glow"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface/50"
              }`}
            >
              <Icon name={item?.icon} size={20} />
              <span className="font-medium">{item?.name}</span>
            </button>
          ))}

          {/* Divider */}
          <div className="border-t border-border/50 my-4"></div>

          {/* Secondary Navigation */}
          {secondaryItems?.map((item) => (
            <button
              key={item?.name}
              onClick={() => handleNavigation(item?.path)}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface/50 transition-all duration-300"
            >
              <Icon name={item?.icon} size={20} />
              <span className="font-medium">{item?.name}</span>
            </button>
          ))}

          {/* Mobile Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2"
              onClick={() => {}}
            >
              <Icon name="Search" size={18} />
              <span>Search</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2"
              onClick={() => {}}
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
                <Icon name="User" size={14} color="white" />
              </div>
              <span>Profile</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
