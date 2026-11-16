'use client'
import { Box, ListItem, ListItemText, Typography, useTheme } from '@mui/material'
import { MuiMarkdown, defaultOverrides, defaultMdxComponents } from 'mui-markdown'

const MarkdownView = ({ text }: { text: string }) => {
  const theme = useTheme()
  return (
    <MuiMarkdown
      overrides={{
        ...defaultOverrides, // This will keep the other default overrides.
        h1: {
          component: Typography,
          props: {
            variant: 'h2',
            color: 'primary',
            py: 2,
          },
        },
        h2: {
          component: Typography,
          props: {
            variant: 'h3',
            color: 'primary',
            py: 1,
          },
        },
        h3: {
          component: Typography,
          props: {
            variant: 'h4',
            color: 'primary',
            py: 1,
          },
        },
        ul: {
          componet: ListItem,
          props: {
            color: theme.palette.primary.main,
          },
        },
        li: {
          componet: ListItemText,
          props: {
            style: {
              color: theme.palette.primary.main,
            },
          },
        },
        p: {
          component: Typography,
          props: {
            variant: 'body1',
            color: 'primary',
            py: 1,
          },
        },
        div: {
          component: Typography,
          color: theme.palette.primary.main,
        },
      }}
    >
      {text}
    </MuiMarkdown>
  )
}
export default MarkdownView
