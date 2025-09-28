import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { supabase } from './supabase.js'

export function GeographicChart() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadGeographicData()
  }, [])

  const loadGeographicData = async () => {
    try {
      setLoading(true)
      
      // Buscar dados dos últimos 12 meses
      const twelveMonthsAgo = new Date()
      twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)
      
      const { data: matriculas, error } = await supabase
        .from('matriculas')
        .select(`
          valor_pago,
          data_compra,
          Leads (
            id,
            enderecos (
              estado
            )
          )
        `)
        .gte('data_compra', twelveMonthsAgo.toISOString().split('T')[0])

      if (error) {
        console.error('Erro ao buscar dados geográficos:', error)
        return
      }

      // Agrupar por estado
      const stateData = {}
      
      matriculas?.forEach(matricula => {
        const estado = matricula.Leads?.enderecos?.estado || 'Não informado'
        const value = parseFloat(matricula.valor_pago) || 0
        
        if (!stateData[estado]) {
          stateData[estado] = {
            estado: estado,
            alunos: 0,
            receita: 0
          }
        }
        
        stateData[estado].alunos += 1
        stateData[estado].receita += value
      })

      // Converter para array e ordenar por número de alunos
      const chartData = Object.values(stateData)
        .sort((a, b) => b.alunos - a.alunos)
        .slice(0, 15) // Top 15 estados

      setData(chartData)
    } catch (error) {
      console.error('Erro ao carregar dados geográficos:', error)
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
          <p className="text-purple-600 font-semibold">
            Alunos: {data.alunos}
          </p>
          <p className="text-green-600">
            Receita: {formatCurrency(data.receita)}
          </p>
          <p className="text-gray-500 text-sm">
            Ticket médio: {formatCurrency(data.receita / data.alunos)}
          </p>
        </div>
      )
    }
    return null
  }

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        <p>Nenhum dado geográfico encontrado</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        <XAxis 
          dataKey="estado" 
          tick={{ fontSize: 11 }}
          className="text-gray-600"
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          className="text-gray-600"
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar 
          dataKey="alunos" 
          fill="#7c3aed"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

