import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { ArrowUpDown, TrendingUp, Users, DollarSign } from 'lucide-react'

export function CourseTable({ onCourseSelect }) {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('receita')
  const [sortOrder, setSortOrder] = useState('desc')

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
          valor,
          data_compra,
          cursos (
            codigo,
            nome,
            sigla
          )
        `)
        .gte('data_compra', twelveMonthsAgo.toISOString().split('T')[0])

      if (error) {
        console.error('Erro ao buscar dados de cursos:', error)
        return
      }

      // Agrupar por curso
      const courseStats = {}
      
      matriculas?.forEach(matricula => {
        const curso = matricula.cursos
        if (!curso) return
        
        const courseKey = curso.codigo
        const value = parseFloat(matricula.valor) || 0
        const date = new Date(matricula.data_compra)
        
        if (!courseStats[courseKey]) {
          courseStats[courseKey] = {
            codigo: curso.codigo,
            nome: curso.nome,
            sigla: curso.sigla,
            alunos: 0,
            receita: 0,
            ultimaVenda: null,
            primeiraVenda: null
          }
        }
        
        courseStats[courseKey].alunos += 1
        courseStats[courseKey].receita += value
        
        if (!courseStats[courseKey].ultimaVenda || date > new Date(courseStats[courseKey].ultimaVenda)) {
          courseStats[courseKey].ultimaVenda = matricula.data_compra
        }
        
        if (!courseStats[courseKey].primeiraVenda || date < new Date(courseStats[courseKey].primeiraVenda)) {
          courseStats[courseKey].primeiraVenda = matricula.data_compra
        }
      })

      // Converter para array e calcular ticket médio
      const courseArray = Object.values(courseStats).map(course => ({
        ...course,
        ticketMedio: course.alunos > 0 ? course.receita / course.alunos : 0
      }))

      setCourses(courseArray)
    } catch (error) {
      console.error('Erro ao carregar dados de cursos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  const sortedCourses = [...courses].sort((a, b) => {
    const aValue = a[sortBy]
    const bValue = b[sortBy]
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(value)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getSortIcon = (field) => {
    if (sortBy !== field) return <ArrowUpDown className="w-4 h-4 text-gray-400" />
    return <ArrowUpDown className={`w-4 h-4 ${sortOrder === 'asc' ? 'rotate-180' : ''} text-blue-600`} />
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Análise Detalhada de Cursos</CardTitle>
          <CardDescription>Performance individual de cada produto</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (courses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Análise Detalhada de Cursos</CardTitle>
          <CardDescription>Performance individual de cada produto</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-gray-500">
            <p>Nenhum curso encontrado</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Análise Detalhada de Cursos</CardTitle>
        <CardDescription>Performance individual de cada produto (últimos 12 meses)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">
                  <Button 
                    variant="ghost" 
                    onClick={() => handleSort('nome')}
                    className="flex items-center space-x-1 p-0 h-auto font-semibold"
                  >
                    <span>Curso</span>
                    {getSortIcon('nome')}
                  </Button>
                </th>
                <th className="text-center p-2">
                  <Button 
                    variant="ghost" 
                    onClick={() => handleSort('alunos')}
                    className="flex items-center space-x-1 p-0 h-auto font-semibold"
                  >
                    <Users className="w-4 h-4" />
                    <span>Alunos</span>
                    {getSortIcon('alunos')}
                  </Button>
                </th>
                <th className="text-center p-2">
                  <Button 
                    variant="ghost" 
                    onClick={() => handleSort('receita')}
                    className="flex items-center space-x-1 p-0 h-auto font-semibold"
                  >
                    <DollarSign className="w-4 h-4" />
                    <span>Receita</span>
                    {getSortIcon('receita')}
                  </Button>
                </th>
                <th className="text-center p-2">
                  <Button 
                    variant="ghost" 
                    onClick={() => handleSort('ticketMedio')}
                    className="flex items-center space-x-1 p-0 h-auto font-semibold"
                  >
                    <TrendingUp className="w-4 h-4" />
                    <span>Ticket Médio</span>
                    {getSortIcon('ticketMedio')}
                  </Button>
                </th>
                <th className="text-center p-2">
                  <Button 
                    variant="ghost" 
                    onClick={() => handleSort('ultimaVenda')}
                    className="flex items-center space-x-1 p-0 h-auto font-semibold"
                  >
                    <span>Última Venda</span>
                    {getSortIcon('ultimaVenda')}
                  </Button>
                </th>
                <th className="text-center p-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {sortedCourses.map((course, index) => (
                <tr key={course.codigo} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="p-3">
                    <div>
                      <div className="font-medium text-gray-900">
                        {course.nome || 'Nome não disponível'}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {course.sigla || course.codigo}
                        </Badge>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <span className="font-semibold text-blue-600">{course.alunos}</span>
                  </td>
                  <td className="p-3 text-center">
                    <span className="font-semibold text-green-600">
                      {formatCurrency(course.receita)}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className="font-semibold text-orange-600">
                      {formatCurrency(course.ticketMedio)}
                    </span>
                  </td>
                  <td className="p-3 text-center text-sm text-gray-600">
                    {formatDate(course.ultimaVenda)}
                  </td>
                  <td className="p-3 text-center">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onCourseSelect && onCourseSelect(course)}
                    >
                      Ver Gráfico
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

