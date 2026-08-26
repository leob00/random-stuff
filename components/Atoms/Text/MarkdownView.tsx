import { MuiMarkdown } from 'mui-markdown'

const MarkdownView = ({ text }: { text: string }) => {
  return <MuiMarkdown>{text}</MuiMarkdown>
}
export default MarkdownView
