import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await API.get('/projects');
                setProjects(res.data);
            } catch (err) {
                // Fixed: Using 'err' to satisfy ESLint
                console.error("Fetch projects error:", err);
            }
        };
        fetchProjects();
    }, []);

    const handleCreateProject = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('/projects', { name, description: desc });
            setProjects(prev => [...prev, res.data]);
            setName(''); 
            setDesc('');
        } catch (err) {
            // Fixed: Using 'err' to satisfy ESLint
            console.error("Create project error:", err);
            alert("Error creating project. Check console for details.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-8">
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-black text-slate-800">My Workspaces</h1>
                        <p className="text-slate-500 font-medium">Select a project to manage tasks</p>
                    </div>
                    <button 
                        onClick={handleLogout} 
                        className="px-4 py-2 text-sm font-bold text-slate-400 hover:text-red-500 transition-colors"
                    >
                        Logout
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Create Project Box */}
                    <div className="bg-white p-8 rounded-[32px] border-2 border-dashed border-slate-200 flex flex-col justify-center">
                        <h2 className="text-lg font-bold mb-4 text-slate-700">Start New Project</h2>
                        <form onSubmit={handleCreateProject} className="space-y-3">
                            <input 
                                value={name} 
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Project Name" 
                                className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
                                required
                            />
                            <textarea 
                                value={desc} 
                                onChange={(e) => setDesc(e.target.value)}
                                placeholder="Short description..." 
                                className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none transition-all"
                            />
                            <button className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]">
                                Create Project
                            </button>
                        </form>
                    </div>

                    {/* Project Cards */}
                    {projects.map(project => (
                        <div 
                            key={project.id} 
                            onClick={() => navigate(`/dashboard/${project.id}`)}
                            className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 cursor-pointer hover:shadow-xl hover:border-indigo-300 transition-all group flex flex-col"
                        >
                            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-xl mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                {project.name ? project.name[0].toUpperCase() : 'P'}
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">{project.name}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-3">
                                {project.description || "Manage your team tasks and track progress in this workspace."}
                            </p>
                            <div className="mt-auto flex items-center text-indigo-600 font-black text-xs uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                                Open Workspace 
                                <span className="ml-2">→</span>
                            </div>
                        </div>
                    ))}
                </div>

                {projects.length === 0 && (
                    <div className="text-center py-20 mt-10">
                        <p className="text-slate-400 font-medium italic">No projects found. Create your first one to get started!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Projects;