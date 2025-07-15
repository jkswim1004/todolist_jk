import React, { useState } from 'react';
import { Plus, X, Calendar, BarChart3, Moon, Sun } from 'lucide-react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  category: string;
  createdAt: string;
}

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>('');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [showStats, setShowStats] = useState<boolean>(false);
  const [completedToday, setCompletedToday] = useState<number>(0);

  // 오늘 날짜
  const today = new Date().toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });

  // 카테고리 색상
  const categoryColors: { [key: string]: string } = {
    '공부': 'bg-blue-500',
    '일': 'bg-green-500',
    '개인': 'bg-purple-500'
  };

  // 할일 추가
  const addTodo = () => {
    if (newTodo.trim() && todos.length < 5) {
      const todo = {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false,
        category: '개인',
        createdAt: new Date().toISOString()
      };
      setTodos([...todos, todo]);
      setNewTodo('');
    }
  };

  // 할일 완료/취소
  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => {
      if (todo.id === id) {
        const updated = { ...todo, completed: !todo.completed };
        if (updated.completed) {
          setCompletedToday(prev => prev + 1);
        } else {
          setCompletedToday(prev => Math.max(0, prev - 1));
        }
        return updated;
      }
      return todo;
    }));
  };

  // 할일 삭제
  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // 카테고리 변경
  const changeCategory = (id: number, category: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, category } : todo
    ));
  };

  // 진행률 계산
  const progress = todos.length > 0 ? (todos.filter(t => t.completed).length / todos.length) * 100 : 0;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="max-w-md mx-auto p-6">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">Focus3</h1>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {today}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowStats(!showStats)}
              className={`p-2 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'
              }`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* 통계 */}
        {showStats && (
          <div className={`mb-6 p-4 rounded-2xl ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-lg`}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">오늘 완료</span>
              <span className="text-2xl font-bold text-green-500">{completedToday}</span>
            </div>
            <div className={`w-full h-2 rounded-full ${
              darkMode ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
              <div 
                className="h-2 bg-green-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* 할일 추가 */}
        <div className={`mb-6 p-4 rounded-2xl ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              placeholder="오늘 할 일을 추가하세요..."
              className={`flex-1 p-3 rounded-lg border-none outline-none ${
                darkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-gray-100 text-gray-900 placeholder-gray-500'
              }`}
              disabled={todos.length >= 5}
            />
            <button
              onClick={addTodo}
              disabled={todos.length >= 5 || !newTodo.trim()}
              className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          {todos.length >= 5 && (
            <p className="text-sm text-yellow-500 mt-2">
              최대 5개까지만 추가할 수 있어요 ✨
            </p>
          )}
        </div>

        {/* 할일 목록 */}
        <div className="space-y-3">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className={`p-4 rounded-2xl transition-all duration-300 ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } shadow-lg ${
                todo.completed ? 'opacity-60 scale-98' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    todo.completed 
                      ? 'bg-green-500 border-green-500' 
                      : `border-gray-300 hover:border-green-500`
                  }`}
                >
                  {todo.completed && (
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                  )}
                </button>
                
                <div className="flex-1">
                  <p className={`font-medium ${
                    todo.completed ? 'line-through text-gray-500' : ''
                  }`}>
                    {todo.text}
                  </p>
                  <div className="flex gap-2 mt-2">
                    {Object.keys(categoryColors).map(category => (
                      <button
                        key={category}
                        onClick={() => changeCategory(todo.id, category)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                          todo.category === category
                            ? `${categoryColors[category]} text-white`
                            : `${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'} hover:bg-gray-600`
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
                
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 빈 상태 */}
        {todos.length === 0 && (
          <div className={`text-center py-12 ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">오늘 할 일이 없어요</p>
            <p className="text-sm">3개 정도의 할 일을 추가해보세요</p>
          </div>
        )}

        {/* 푸터 */}
        <div className={`mt-12 text-center text-sm ${
          darkMode ? 'text-gray-500' : 'text-gray-400'
        }`}>
          <p>하루에 3-5개만, 집중해서 🎯</p>
        </div>
      </div>
    </div>
  );
};

export default App; 