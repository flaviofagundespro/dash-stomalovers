import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { supabase } from './supabase.js'

const COLORS = ['#2563eb', '#7c3aed', '#dc2626', '#ea580c', '#16a34a', '#0891b2', '#be185d']

export function CoursePieChart() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCourseData()
  }, [])

  const loadCourseData = async () => {
    try {
      setLoading(true)
      
      // Buscar dados dos últimos 12 meses
      const twelveMonthsAgo = new Date()
      twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)
      
      const { data: matriculas, error } = await supabase
        .from('matriculas')
        .select(`
          valor_pago,
          cursos (
            nome
          )
        `)
        .gte('data_compra', twelveMonthsAgo.toISOString().split('T')[0])

      if (error) {
        console.error('Erro ao buscar dados de cursos:', error)
        return
      }

      // Agrupar por curso
      const courseRevenue = {}
      
      matriculas?.forEach(matricula => {
        const courseName = matricula.cursos?.nome || 'Curso não identificado'
        const value = parseFloat(matricula.valor_pago) || 0
        
        if (!courseRevenue[courseName]) {
          courseRevenue[courseName] = 0
        }
        
        courseRevenue[courseName] += value
      })

      // Converter para array e ordenar por receita
      const chartData = Object.entries(courseRevenue)
        .map(([name, value]) => ({
          name: name.length > 30 ? name.substring(0, 30) + '...' : name,
          fullName: name,
          value: value
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 7) // Top 7 cursos

      setData(chartData)
    } catch (error) {
      console.error('Erro ao carregar dados de cursos:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(value)
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{data.fullName}</p>
          <p className="text-blue-600 font-semibold">
            {formatCurrency(data.value)}
          </p>
          <p className="text-sm text-gray-500">
            {((data.value / data.total) * 100).toFixed(1)}% do total
          </p>
        </div>
      )
    }
    return null
  }

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        <p>Nenhum dado de curso encontrado</p>
      </div>
    )
  }

  // Calcular total para percentuais
  const total = data.reduce((sum, item) => sum + item.value, 0)
  const dataWithTotal = data.map(item => ({ ...item, total }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={dataWithTotal}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {dataWithTotal.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          verticalAlign="bottom" 
          height={36}
          formatter={(value, entry) => (
            <span style={{ color: entry.color, fontSize: '12px' }}>
              {value}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

