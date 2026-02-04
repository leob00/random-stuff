'use client'
import { useState } from 'react'
import TabButton from './TabButton'

export interface TabInfo {
  title: string
  selected?: boolean
}

const TabButtonList = ({ tabs, onSelected }: { tabs: TabInfo[]; onSelected: (title: string) => void }) => {
  const [allTabs, setAllTabs] = useState(tabs)
  const [currentTab, setCurrentTab] = useState(tabs.find((o) => o.selected)!.title)

  const handleClicked = (title: string) => {
    setCurrentTab(allTabs.find((o) => o.title === title)!.title)
    onSelected(title)
  }
  return (
    <>
      {allTabs.map((tab) => (
        <TabButton key={tab.title} title={tab.title} selected={currentTab === tab.title} onClicked={handleClicked} />
      ))}
    </>
  )
}

export default TabButtonList
