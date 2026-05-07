import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [taskTitle, setTaskTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [editingTask, setEditingTask] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await API.get('/tasks');
                setTasks(res.data);
            } catch (error) {
                if (error.response?.status === 401) navigate('/');
            }
        };
        fetchTasks();
    }, [navigate]);

    const handleAddTask = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('/tasks', { title: taskTitle, description, due_date: dueDate || null, priority });
            setTasks(prev => [res.data, ...prev]);
            resetForm();
        } catch (error) { console.error(error); }
    };

    const handleUpdateTask = async (e) => {
        e.preventDefault();
        try {
            const res = await API.put(`/tasks/${editingTask.id}`, { title: taskTitle, description, due_date: dueDate || null, priority });
            setTasks(prev => prev.map(t => t.id === editingTask.id ? res.data : t));
            resetForm();
        } catch (error) { console.error(error); }
    };

    const handleEditClick = (task) => {
        setEditingTask(task);
        setTaskTitle(task.title);
        setDescription(task.description || '');
        setDueDate(task.due_date ? task.due_date.split('T')[0] : '');
        setPriority(task.priority);
    };

    const resetForm = () => {
        setEditingTask(null); setTaskTitle(''); setDescription(''); setDueDate(''); setPriority('Medium');
    };

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            const res = await API.put(`/tasks/${id}/status`, { status: currentStatus });
            setTasks(prev => prev.map(t => t.id === id ? res.data : t));
        } catch (error) { console.error(error); }
    };

    const handleDeleteTask = async (id) => {
        if (window.confirm("DELETE TASK?")) {
            await API.delete(`/tasks/${id}`);
            setTasks(prev => prev.filter(t => t.id !== id));
        }
    };

    const filteredTasks = tasks.filter(t => 
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        (statusFilter === 'All' || t.status === statusFilter)
    );

    const completed = tasks.filter(t => t.status === 'Completed').length;
    const progress = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;

    // Common Text Style for "Block" look
    const blockTextStyle = {
        color: '#1e293b',
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: '1px'
    };

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif' }}>
            
            {/* HEADER AREA */}
            <header style={{ backgroundColor: 'white', borderBottom: '2px solid #1e293b', padding: '15px 40px', position: 'sticky', top: 0, zIndex: 100 }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '42px', height: '42px', backgroundColor: '#1e293b', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '900', fontSize: '24px' }}>T</div>
                        <h1 style={{ ...blockTextStyle, fontSize: '20px', margin: 0 }}>TASKFLOW INTERNAL</h1>
                    </div>

                    <div style={{ flex: 1, maxWidth: '500px', margin: '0 20px' }}>
                        <input 
                            type="text" 
                            placeholder="SEARCH TASKS..." 
                            style={{ ...blockTextStyle, width: '100%', padding: '12px 15px', borderRadius: '4px', border: '2px solid #1e293b', backgroundColor: '#f1f5f9', outline: 'none', fontSize: '12px' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <button 
                        onClick={() => { localStorage.removeItem('token'); navigate('/'); }}
                        style={{ ...blockTextStyle, padding: '10px 25px', border: '2px solid #1e293b', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', backgroundColor: 'white' }}
                    >
                        LOGOUT
                    </button>
                </div>
            </header>

            {/* CONTENT AREA */}
            <main style={{ maxWidth: '800px', width: '100%', margin: '40px auto', padding: '0 20px' }}>
                
                {/* 1. STATS SECTION */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
                    {[
                        { label: 'TOTAL', value: tasks.length },
                        { label: 'COMPLETED', value: completed },
                        { label: 'EFFICIENCY', value: `${progress}%` }
                    ].map((stat) => (
                        <div key={stat.label} style={{ backgroundColor: 'white', padding: '25px', borderRadius: '4px', border: '2px solid #1e293b', boxShadow: '8px 8px 0px #1e293b' }}>
                            <label style={{ ...blockTextStyle, fontSize: '12px', color: '#64748b' }}>{stat.label}</label>
                            <div style={{ ...blockTextStyle, fontSize: '40px', marginTop: '5px' }}>{stat.value}</div>
                        </div>
                    ))}
                </div>

                {/* 2. CREATE TASK SECTION */}
                <div style={{ backgroundColor: 'white', padding: '35px', borderRadius: '4px', border: '2px solid #1e293b', marginBottom: '30px', boxShadow: '8px 8px 0px #cbd5e1' }}>
                    <h2 style={{ ...blockTextStyle, fontSize: '18px', marginBottom: '25px', borderLeft: '8px solid #1e293b', paddingLeft: '15px' }}>
                        {editingTask ? 'EDIT TASK DETAILS' : 'CREATE NEW TASK'}
                    </h2>
                    <form onSubmit={editingTask ? handleUpdateTask : handleAddTask} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <input type="text" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} placeholder="TASK NAME" style={{ ...blockTextStyle, padding: '15px', borderRadius: '4px', border: '2px solid #1e293b', backgroundColor: '#f8fafc', fontSize: '12px' }} required />
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="ADD NOTES..." style={{ ...blockTextStyle, padding: '15px', borderRadius: '4px', border: '2px solid #1e293b', backgroundColor: '#f8fafc', height: '50px', resize: 'none', fontSize: '12px' }} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <select value={priority} onChange={(e) => setPriority(e.target.value)} style={{ ...blockTextStyle, padding: '15px', borderRadius: '4px', border: '2px solid #1e293b', backgroundColor: '#f8fafc', fontSize: '12px', appearance: 'none' }}>
                                <option value="Low">LOW PRIORITY</option>
                                <option value="Medium">MEDIUM PRIORITY</option>
                                <option value="High">HIGH PRIORITY</option>
                            </select>
                            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} style={{ ...blockTextStyle, padding: '15px', borderRadius: '4px', border: '2px solid #1e293b', backgroundColor: '#f8fafc', fontSize: '12px' }} />
                        </div>
                        <button type="submit" style={{ ...blockTextStyle, padding: '20px', backgroundColor: '#1e293b', color: 'white', border: 'none', cursor: 'pointer', fontSize: '14px', borderRadius: '4px', transition: '0.2s transform' }}>
                            {editingTask ? 'UPDATE TASK NOW' : 'CONFIRM & ADD TASK'}
                        </button>
                    </form>
                </div>

                {/* 3. FILTER TABS */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
                    <div style={{ backgroundColor: 'white', padding: '8px', borderRadius: '4px', border: '2px solid #1e293b', display: 'flex', gap: '10px' }}>
                        {['All', 'Pending', 'Completed'].map(f => (
                            <button key={f} onClick={() => setStatusFilter(f)} style={{ ...blockTextStyle, padding: '10px 25px', borderRadius: '2px', border: 'none', cursor: 'pointer', fontSize: '12px', backgroundColor: statusFilter === f ? '#1e293b' : 'transparent', color: statusFilter === f ? 'white' : '#1e293b' }}>
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 4. TASK LIST */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {filteredTasks.map(task => (
                        <div key={task.id} style={{ backgroundColor: 'white', padding: '30px', borderRadius: '4px', border: '2px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '4px 4px 0px #f1f5f9' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                                <button onClick={() => handleToggleStatus(task.id, task.status)} style={{ width: '28px', height: '28px', borderRadius: '2px', border: '3px solid #1e293b', backgroundColor: task.status === 'Completed' ? '#22c55e' : 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '900' }}>
                                    {task.status === 'Completed' && '✓'}
                                </button>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span style={{ ...blockTextStyle, backgroundColor: '#1e293b', color: 'white', fontSize: '10px', padding: '3px 10px', borderRadius: '2px' }}>STATUS</span>
                                        <h4 style={{ ...blockTextStyle, margin: 0, fontSize: '18px', color: task.status === 'Completed' ? '#94a3b8' : '#1e293b', textDecoration: task.status === 'Completed' ? 'line-through' : 'none' }}>{task.title}</h4>
                                    </div>
                                    <div style={{ ...blockTextStyle, marginTop: '10px', fontSize: '11px', color: '#64748b' }}>
                                        {task.priority} // DUE: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'N/A'}
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '20px' }}>
                                <button onClick={() => handleEditClick(task)} style={{ ...blockTextStyle, border: 'none', backgroundColor: 'transparent', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}>EDIT</button>
                                <button onClick={() => handleDeleteTask(task.id)} style={{ ...blockTextStyle, border: 'none', backgroundColor: 'transparent', fontSize: '12px', cursor: 'pointer', color: '#ef4444' }}>DELETE</button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;