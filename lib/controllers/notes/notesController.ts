import { UserNotesModel } from 'components/reducers/notesReducer'
import { UserNote } from 'lib/backend/api/aws/models/apiGatewayModels'
import { constructUserNotePrimaryKey } from 'lib/backend/api/aws/util'
import { getUtcNow } from 'lib/util/dateUtil'
import { cloneDeep, findIndex, orderBy } from 'lodash'

export async function buildSaveModel(model: UserNotesModel, item: UserNote) {
  const result = cloneDeep(model)

  const now = getUtcNow().format()
  item.dateModified = now
  if (!item.id) {
    item.id = constructUserNotePrimaryKey(model.username)
    item.dateCreated = now

    result.noteTitles.push({
      id: item.id,
      title: item.title,
      body: '',
      dateCreated: now,
      dateModified: now,
      expirationDate: item.expirationDate,
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
        dateModified: now,
        expirationDate: item.expirationDate,
      })
    }
  }
  result.noteTitles = orderBy(result.noteTitles, ['dateModified'], ['desc'])

  return result
}
