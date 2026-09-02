import { descriptionSection } from '../sections/DESCRIPTION'
import { descriptionAndFileSection } from '../sections/DESCRIPTION_AND_FILE'
import { REVIEW_AND_PLACE, SECTION_KEYS } from '../sections/keys'
import { multiSelectAndTextSection } from '../sections/MULTI_SELECT_AND_TEXT'
import { reviewAndPlaceSection } from '../sections/REVIEW_AND_PLACE'
import { textFieldSection } from '../sections/TEXT_FIELD'
import { textAndFileSection } from '../sections/TEXT_AND_FILE'
import type { SectionModule } from '../sections/types'

const sections = new Map<string, SectionModule>([
  [SECTION_KEYS.TEXT_FIELD, textFieldSection],
  [SECTION_KEYS.TEXT_AND_FILE, textAndFileSection],
  [SECTION_KEYS.DESCRIPTION, descriptionSection],
  [REVIEW_AND_PLACE, reviewAndPlaceSection],
  [SECTION_KEYS.MULTI_SELECT_AND_TEXT, multiSelectAndTextSection],
  [SECTION_KEYS.DESCRIPTION_AND_FILE, descriptionAndFileSection],
])

export function getSection(sectionKey: string): SectionModule {
  const section = sections.get(sectionKey)
  if (!section) {
    throw new Error(`Unknown section: ${sectionKey}`)
  }
  return section
}

export function listSectionKeys(): string[] {
  return [...sections.keys()]
}
