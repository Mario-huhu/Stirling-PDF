import React, { useState, useCallback, useMemo } from "react";
import { Button, SegmentedControl, Loader } from "@mantine/core";
import { useRainbowThemeContext } from "./RainbowThemeProvider";
import LanguageSelector from "./LanguageSelector";
import rainbowStyles from '../../styles/rainbow.module.css';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditNoteIcon from "@mui/icons-material/EditNote";
import FolderIcon from "@mui/icons-material/Folder";
import { Group } from "@mantine/core";
import { ModeType } from '../../types/fileContext';

// Stable view option objects that don't recreate on every render
const VIEW_OPTIONS_BASE = [
  { value: "viewer", icon: VisibilityIcon },
  { value: "pageEditor", icon: EditNoteIcon },
  { value: "fileEditor", icon: FolderIcon },
] as const;

interface TopControlsProps {
  currentView: ModeType;
  setCurrentView: (view: ModeType) => void;
  selectedToolKey?: string | null;
}

const TopControls = ({
  currentView,
  setCurrentView,
  selectedToolKey,
}: TopControlsProps) => {
  const { themeMode, isRainbowMode, isToggleDisabled, toggleTheme } = useRainbowThemeContext();
  const [switchingTo, setSwitchingTo] = useState<string | null>(null);

  const isToolSelected = selectedToolKey !== null;

  const handleViewChange = useCallback((view: string) => {
    // Guard against redundant changes
    if (view === currentView) return;
    
    // Show immediate feedback
    setSwitchingTo(view);

    // Defer the heavy view change to next frame so spinner can render
    requestAnimationFrame(() => {
      // Give the spinner one more frame to show
      requestAnimationFrame(() => {
        setCurrentView(view as ModeType);
        
        // Clear the loading state after view change completes
        setTimeout(() => setSwitchingTo(null), 300);
      });
    });
  }, [setCurrentView, currentView]);

  // Memoize the SegmentedControl data with stable references
  const viewOptions = useMemo(() => 
    VIEW_OPTIONS_BASE.map(option => ({
      value: option.value,
      label: (
        <Group gap={option.value === "viewer" ? 5 : 4}>
          {switchingTo === option.value ? (
            <Loader size="xs" />
          ) : (
            <option.icon fontSize="small" />
          )}
        </Group>
      )
    })), [switchingTo]);

  const getThemeIcon = () => {
    if (isRainbowMode) return <AutoAwesomeIcon className={rainbowStyles.rainbowText} />;
    if (themeMode === "dark") return <LightModeIcon />;
    return <DarkModeIcon />;
  };

  return (
    <div className="absolute left-0 w-full top-0 z-[100] pointer-events-none">
      <div className={`absolute left-4 pointer-events-auto flex gap-2 items-center ${
        isToolSelected ? 'top-4' : 'top-1/2 -translate-y-1/2'
      }`}>
        <Button
          onClick={toggleTheme}
          variant="subtle"
          size="md"
          aria-label="Toggle theme"
          disabled={isToggleDisabled}
          className={isRainbowMode ? rainbowStyles.rainbowButton : ''}
          title={
            isToggleDisabled
              ? "Button disabled for 3 seconds..."
              : isRainbowMode
                ? "Rainbow Mode Active! Click to exit"
                : "Toggle theme (click rapidly 6 times for a surprise!)"
          }
          style={isToggleDisabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
        >
          {getThemeIcon()}
        </Button>
        <LanguageSelector />
      </div>
      {!isToolSelected && (
        <div className="flex justify-center items-center h-full pointer-events-auto">
            <SegmentedControl
              data={viewOptions}
              value={currentView}
              onChange={handleViewChange}
              color="blue"
              radius="xl"
              size="md"
              fullWidth
              className={isRainbowMode ? rainbowStyles.rainbowSegmentedControl : ''}
              style={{
                transition: 'all 0.2s ease',
                opacity: switchingTo ? 0.8 : 1,
              }}
            />
        </div>
      )}
    </div>
  );
};

export default TopControls;
