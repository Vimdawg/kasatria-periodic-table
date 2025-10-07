import { fetchCsvData, PersonData } from '@/lib/fetchCsv'
import SceneClient from './SceneClient'

export default async function ScenePage() {
  let data: PersonData[] = []
  let error: string | null = null

  try {
    data = await fetchCsvData()
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load data'
    console.error('Error in ScenePage:', err)
  }

  return <SceneClient data={data} error={error} />
}

