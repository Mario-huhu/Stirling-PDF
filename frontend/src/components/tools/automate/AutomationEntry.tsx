import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Group, Text, Badge } from '@mantine/core';

interface AutomationEntryProps {
  /** Optional title for the automation (usually for custom ones) */
  title?: string;
  /** MUI Icon component for the badge */
  badgeIcon?: React.ComponentType<any>;
  /** Array of tool operation names in the workflow */
  operations: string[];
  /** Click handler */
  onClick: () => void;
  /** Whether to keep the icon at normal color (for special cases like "Add New") */
  keepIconColor?: boolean;
}

export default function AutomationEntry({
  title,
  badgeIcon: BadgeIcon,
  operations,
  onClick,
  keepIconColor = false
}: AutomationEntryProps) {
  const { t } = useTranslation();

  const renderContent = () => {
    if (title) {
      // Custom automation with title
      return (
        <Group gap="md" align="center" justify="flex-start" style={{ width: '100%' }}>
          {BadgeIcon && (
            <BadgeIcon
              style={{
                color: keepIconColor ? 'inherit' : 'var(--mantine-color-text)'
              }}
            />
          )}
          <Text size="sm" style={{ flex: 1, textAlign: 'left', color: 'var(--mantine-color-text)' }}>
            {title}
          </Text>
        </Group>
      );
    } else {
      // Suggested automation showing tool chain
      return (
        <Group gap="md" align="center" justify="flex-start" style={{ width: '100%' }}>
          {BadgeIcon && (
            <BadgeIcon
              style={{
                color: keepIconColor ? 'inherit' : 'var(--mantine-color-text)'
              }}
            />
          )}
          <Group gap="xs" justify="flex-start" style={{ flex: 1 }}>
            {operations.map((op, index) => (
              <React.Fragment key={`${op}-${index}`}>
                <Text size="sm" style={{ color: 'var(--mantine-color-text)' }}>
                  {t(`${op}.title`, op)}
                </Text>

                {index < operations.length - 1 && (
                  <Text size="xs" c="dimmed" style={{ color: 'var(--mantine-color-text)' }}>
                    →
                  </Text>
                )}
              </React.Fragment>
            ))}
          </Group>
        </Group>
      );
    }
  };

  return (
    <Button
      variant="subtle"
      fullWidth
      onClick={onClick}
      style={{
        height: 'auto',
        padding: '0.75rem 1rem',
        justifyContent: 'flex-start',
        display: 'flex'
      }}
    >
      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
        {renderContent()}
      </div>
    </Button>
  );
}
