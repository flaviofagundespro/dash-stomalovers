import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { supabase } from './supabase.js'

export function CourseTimelineChart({ selectedCourse }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (selectedCourse) {
      loadCourseTimelineData()
    }
  }, [selectedCourse])

  const loadCourseTimelineData = async () => {
    if (!selectedCourse) return
    
    try {
      setLoading(true)
      
      // Buscar dados dos últimos 12 meses para o curso específico
      const twelveMonthsAgo = new Date()
      twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)
      
      const { data: matriculas, error } = await supabase
        .from('matriculas')
        .select('valor, data_compra')
        .eq('curso_id', selectedCourse.codigo)
        .gte('data_compra', twelveMonthsAgo.toISOString().split('T')[0])
        .order('data_compra', { ascending: true })

      if (error) {
        console.error('Erro ao buscar dados do curso:', error)
        return
      }

      // Agrupar por mês
      const monthlyData = {}
      
      matriculas?.forEach(matricula => {
        const date = new Date(matricula.data_compra)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        const monthName = date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = {
            month: monthName,
            vendas: 0,
            receita: 0,
            date: new Date(date.getFullYear(), date.getMonth(), 1)
          }
        }
        
        monthlyData[monthKey].vendas += 1
        monthlyData[monthKey].receita += parseFloat(matricula.valor) || 0
      })

      // Converter para array e ordenar por data
      const chartData = Object.values(monthlyData)
        .sort((a, b) => a.date - b.date)
        .map(item => ({
          month: item.month,
          vendas: item.vendas,
          receita: item.receita
        }))

      setData(chartData)
    } catch (error) {
      console.error('Erro ao carregar dados do curso:', error)
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

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-blue-600 font-semibold">
            Vendas: {data.vendas}
          </p>
          <p className="text-green-600">
            Receita: {formatCurrency(data.receita)}
          </p>
          {data.vendas > 0 && (
            <p className="text-gray-500 text-sm">
              Ticket médio: {formatCurrency(data.receita / data.vendas)}
            </p>
          )}
        </div>
      )
    }
    return null
  }

  if (!selectedCourse) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <p>Selecione um curso na tabela acima</p>
          <p className="text-sm mt-1">para ver o gráfico de vendas ao longo do tempo</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Carregando dados de {selectedCourse.nome}...</p>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <p>Nenhuma venda encontrada para</p>
          <p className="font-medium">{selectedCourse.nome}</p>
          <p className="text-sm mt-1">nos últimos 12 meses</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4">
        <h4 className="font-medium text-gray-900">{selectedCourse.nome}</h4>
        <p className="text-sm text-gray-600">Evolução de vendas nos últimos 12 meses</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 12 }}
            className="text-gray-600"
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            className="text-gray-600"
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="vendas" 
            stroke="#2563eb" 
            strokeWidth={3}
            dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#2563eb', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

