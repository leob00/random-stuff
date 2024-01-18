import { sleep } from 'lib/util/timers'
import { range } from 'lodash'
import React from 'react'
import ListIterator, { QueuedTask } from './ListIterator'

const ListIteratorLayout = () => {
  const testItems = range(0, 10)
  const items: QueuedTask[] = testItems.map((m, i) => {
    return {
      id: crypto.randomUUID(),
      description: `test description ${i + 1}`,
      fn: sleep(1500),
    }
  })

  return <ListIterator items={items} pollingInterval={1000} />
}

export default ListIteratorLayout
