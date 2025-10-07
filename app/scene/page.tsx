import { PersonData, fetchCsvData } from '@/lib/fetchCsv'
import SceneClient from './SceneClient'

export default async function ScenePage() {
  console.log('ScenePage: Starting to fetch CSV data...')
  
  try {
    const data = await fetchCsvData()
    console.log('ScenePage: Successfully fetched', data.length, 'items')
    return <SceneClient data={data} error={null} />
  } catch (error) {
    console.error('ScenePage: Error fetching CSV data:', error)
    return <SceneClient data={[]} error={error instanceof Error ? error.message : 'Failed to fetch data'} />
  }
}

