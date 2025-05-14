import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Chart from '../components/Chart'
import SectionBox from '../components/layout/SectionBox'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLink } from '@fortawesome/free-solid-svg-icons'
import { isToday } from 'date-fns'

export default function AnalyticsPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(null)
  const [views, setViews] = useState([])
  const [clicks, setClicks] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        navigate('/login')
        return
      }

      const { data: page } = await supabase
        .from('pages')
        .select('*')
        .eq('owner_id', session.user.id)
        .single()

      if (!page) {
        navigate('/app/account')
        return
      }

      setPage(page)

      const { data: views } = await supabase
        .from('events')
        .select('created_at')
        .eq('type', 'view')
        .eq('page_id', page.id)

      const { data: clicks } = await supabase
        .from('events')
        .select('*')
        .eq('type', 'click')
        .eq('page_id', page.id)

      setViews(views || [])
      setClicks(clicks || [])
    }

    fetchData()
  }, [navigate])

  if (!page) return null

  // Group views by date
  const groupedViews = views.reduce((acc, view) => {
    const date = new Date(view.created_at).toISOString().split('T')[0]
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {})

  const viewsData = Object.entries(groupedViews).map(([date, count]) => ({
    date,
    views: count,
  }))

  return (
    <div>
      <SectionBox>
        <h2 className="text-xl mb-6 text-center">Views</h2>
        <Chart data={viewsData} />
      </SectionBox>
      <SectionBox>
        <h2 className="text-xl mb-6 text-center">Clicks</h2>
        {page.links.map(link => (
          <div key={link.title} className="md:flex gap-4 items-center border-t border-gray-200 py-4">
            <div className="text-blue-500 pl-4">
              <FontAwesomeIcon icon={faLink} />
            </div>
            <div className="grow">
              <h3>{link.title || 'no title'}</h3>
              <p className="text-gray-700 text-sm">{link.subtitle || 'no description'}</p>
              <a className="text-xs text-blue-400" target="_blank" href={link.url} rel="noreferrer">{link.url}</a>
            </div>
            <div className="text-center">
              <div className="border rounded-md p-2 mt-1 md:mt-0">
                <div className="text-3xl">
                  {clicks.filter(c => c.uri === link.url && isToday(new Date(c.created_at))).length}
                </div>
                <div className="text-gray-400 text-xs uppercase font-bold">clicks today</div>
              </div>
            </div>
            <div className="text-center">
              <div className="border rounded-md p-2 mt-1 md:mt-0">
                <div className="text-3xl">
                  {clicks.filter(c => c.uri === link.url).length}
                </div>
                <div className="text-gray-400 text-xs uppercase font-bold">clicks total</div>
              </div>
            </div>
          </div>
        ))}
      </SectionBox>
    </div>
  )
}