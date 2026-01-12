
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Animal {
  id: number;
  name: string;
  type: string;
  status: string;
  location: string;
  date: string;
  image: string | null;
  description: string | null;
  contact: string | null;
}

const LostAnimals: React.FC = () => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'lost' | 'found'>('all');
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('dog');
  const [newLocation, setNewLocation] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newContact, setNewContact] = useState('');

  // Fetch Data
  useEffect(() => {
    fetchAnimals();
  }, []);

  const fetchAnimals = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('animals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching animals:', error);
    else setAnimals(data || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newAnimal = {
      name: newName,
      type: newType,
      status: 'lost',
      location: newLocation,
      date: new Date().toISOString().split('T')[0],
      image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=500&q=80", // Placeholder for now
      description: newDesc,
      contact: newContact
    };

    const { data, error } = await supabase
      .from('animals')
      .insert([newAnimal])
      .select();

    if (error) {
      alert('Error reporting pet: ' + error.message);
    } else {
      if (data) setAnimals([data[0], ...animals]);
      setShowForm(false);
      setNewName('');
      setNewLocation('');
      setNewDesc('');
      setNewContact('');
    }
  };

  const filteredAnimals = animals.filter(a => filter === 'all' || a.status === filter);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 md:p-8">
      <Link to="/" className="text-purple-400 hover:text-purple-300 mb-6 inline-block">&larr; Back to Hub</Link>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold font-mono">🐾 Lost & Found</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-purple-600 hover:bg-purple-500 px-6 py-2 rounded-full font-bold transition-all"
        >
          {showForm ? 'Cancel' : 'Report Lost Pet'}
        </button>
      </div>

      {/* Report Form */}
      {showForm && (
        <div className="bg-slate-800 p-6 rounded-xl border border-purple-500/50 mb-8 animate-fade-in-down">
          <h2 className="text-2xl font-bold mb-4">Report a Lost Pet</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text" placeholder="Pet Name" required
                value={newName} onChange={e => setNewName(e.target.value)}
                className="bg-slate-700 p-3 rounded text-white"
              />
              <select
                value={newType} onChange={e => setNewType(e.target.value)}
                className="bg-slate-700 p-3 rounded text-white"
              >
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
                <option value="other">Other</option>
              </select>
            </div>
            <input
              type="text" placeholder="Last Seen Location" required
              value={newLocation} onChange={e => setNewLocation(e.target.value)}
              className="bg-slate-700 p-3 rounded text-white w-full"
            />
            <input
              type="text" placeholder="Contact Info (Phone/Email)" required
              value={newContact} onChange={e => setNewContact(e.target.value)}
              className="bg-slate-700 p-3 rounded text-white w-full"
            />
            <textarea
              placeholder="Description (Features, collar, etc.)" required
              value={newDesc} onChange={e => setNewDesc(e.target.value)}
              className="bg-slate-700 p-3 rounded text-white w-full h-24"
            />
            <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 py-3 rounded font-bold">
              Submit Alert
            </button>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full ${filter === 'all' ? 'bg-white text-slate-900 font-bold' : 'bg-slate-800 text-slate-400'}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('lost')}
          className={`px-4 py-2 rounded-full ${filter === 'lost' ? 'bg-red-500 text-white font-bold' : 'bg-slate-800 text-slate-400'}`}
        >
          Lost 🛑
        </button>
        <button
          onClick={() => setFilter('found')}
          className={`px-4 py-2 rounded-full ${filter === 'found' ? 'bg-green-500 text-white font-bold' : 'bg-slate-800 text-slate-400'}`}
        >
          Found ✅
        </button>
      </div>

      {loading ? (
        <div className="text-center text-slate-400 py-12">Loading pets from database...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAnimals.length === 0 && (
            <div className="col-span-full text-center text-slate-500 py-12">No animals found.</div>
          )}
          {filteredAnimals.map(animal => (
            <div key={animal.id} className="bg-slate-800 rounded-xl overflow-hidden hover:shadow-2xl transition-all hover:scale-[1.02] border border-slate-700 group">
              <div className="h-48 overflow-hidden relative">
                <img src={animal.image || 'https://via.placeholder.com/500'} alt={animal.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-bold uppercase ${animal.status === 'lost' ? 'bg-red-600' : 'bg-green-600'}`}>
                  {animal.status}
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-2xl font-bold">{animal.name}</h3>
                  <span className="text-slate-400 text-sm">{animal.date}</span>
                </div>
                <p className="text-purple-400 mb-2 flex items-center gap-2">
                  📍 {animal.location}
                </p>
                <p className="text-slate-300 mb-4">{animal.description}</p>
                <div className="border-t border-slate-700 pt-4 flex justify-between items-center text-sm">
                  <span className="text-slate-500">Contact:</span>
                  <span className="font-mono text-cyan-400">{animal.contact}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LostAnimals;

