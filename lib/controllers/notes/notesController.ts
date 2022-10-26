import { UserNotesModel } from 'components/reducers/notesReducer'
import { constructUserNotePrimaryKey } from 'lib/backend/api/aws/util'
import { UserNote } from 'lib/models/randomStuffModels'
import { getUtcNow } from 'lib/util/dateUtil'
import { cloneDeep, findIndex, orderBy } from 'lodash'

export function buildSaveModel(model: UserNotesModel, item: UserNote) {
  const result = cloneDeep(model)

  if (!item.id) {
    item.id = constructUserNotePrimaryKey(model.username)
    const now = getUtcNow().format()
    result.noteTitles.push({
      id: item.id,
      title: item.title,
      body: '',
      dateCreated: now,
      dateModified: now,
    })
  } else {
    const existingIx = findIndex(result.noteTitles, (e) => {
      return e.id === item.id
    })
    if (existingIx > -1) {
      result.noteTitles.splice(existingIx, 1)
      result.noteTitles.push({
        id: item.id,
        title: item.title,
        body: '',
        dateCreated: item.dateCreated,
        dateModified: getUtcNow().format(),
      })
    }
  }
  item.dateModified = getUtcNow().format()
  result.noteTitles = orderBy(result.noteTitles, ['dateModified'], ['desc'])
  model.userProfile.noteTitles = result.noteTitles

  return model
}
