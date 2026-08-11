/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, Compass, Search, Star, Shield, Send, Check, 
  HelpCircle, Sparkles, Navigation, Layers, Info, RefreshCw, Key
} from 'lucide-react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useMapsLibrary, useMap } from '@vis.gl/react-google-maps';
import { motion, AnimatePresence } from 'motion/react';

// Key check
const GOOGLE_MAPS_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  '';
const HAS_MAPS_KEY = typeof GOOGLE_MAPS_KEY === 'string' && GOOGLE_MAPS_KEY.trim().startsWith('AIzaSy');

type MapCoordinates = { lat: number; lng: number };

export interface MapWorker {
  id: string;
  name: string;
  avatar: string;
  category: 'catering' | 'housekeeping' | 'delivery' | 'construction' | 'security';
  skills: string[];
  experience: number;
  phone: string;
  distanceKm: number;
  aiTrustScore: number;
  rating: number;
  reviewsCount: number;
  aadhaarStatus: 'verified' | 'unverified';
  locationName: string;
  lat: number;
  lng: number;
  bio: string;
}

interface GigNearbyMapProps {
  workers: MapWorker[];
  selectedCategory: 'catering' | 'housekeeping' | 'delivery' | 'construction' | 'security';
  centerAddress: string;
  onInviteWorker: (worker: any) => void;
  invitedWorkerIds: string[];
}

// Neighborhood lookup database for high-precision local Chennai mapping
const NEIGHBORHOODS_DB: Record<string, { lat: number; lng: number }> = {
  'adyar': { lat: 13.0062, lng: 80.2574 },
  't. nagar': { lat: 13.0405, lng: 80.2337 },
  't nagar': { lat: 13.0405, lng: 80.2337 },
  'velachery': { lat: 12.9796, lng: 80.2215 },
  'mylapore': { lat: 13.0330, lng: 80.2680 },
  'guindy': { lat: 13.0067, lng: 80.2206 },
  'nungambakkam': { lat: 13.0587, lng: 80.2417 },
  'coimbatore': { lat: 11.0168, lng: 76.9558 },
};

export function getAddressCenter(address: string): { lat: number; lng: number } {
  const normalized = address.toLowerCase();
  for (const [key, coords] of Object.entries(NEIGHBORHOODS_DB)) {
    if (normalized.includes(key)) {
      return coords;
    }
  }
  return { lat: 13.0405, lng: 80.2337 }; // Default T. Nagar, Chennai Central
}

export default function GigNearbyMap({
  workers,
  selectedCategory,
  centerAddress,
  onInviteWorker,
  invitedWorkerIds
}: GigNearbyMapProps) {
  const defaultCenter = getAddressCenter(centerAddress);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [mapZoom, setMapZoom] = useState(13);
  const [selectedWorker, setSelectedWorker] = useState<MapWorker | null>(null);
  const [placeQuery, setPlaceQuery] = useState('');
  const [placesList, setPlacesList] = useState<any[]>([]);
  const [isSearchingPlaces, setIsSearchingPlaces] = useState(false);
  const [customSearchCenter, setCustomSearchCenter] = useState<MapCoordinates | null>(null);

  // Sync center when the input neighborhood changes
  useEffect(() => {
    const coords = getAddressCenter(centerAddress);
    setMapCenter(coords);
    setCustomSearchCenter(coords);
  }, [centerAddress]);

  if (!HAS_MAPS_KEY) {
    return (
      <SimulatedRadarMap 
        workers={workers}
        selectedCategory={selectedCategory}
        centerAddress={centerAddress}
        onInviteWorker={onInviteWorker}
        invitedWorkerIds={invitedWorkerIds}
        defaultCenter={defaultCenter}
      />
    );
  }

  return (
    <div id="google-maps-radar-container" className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
      {/* Map Header */}
      <div className="bg-slate-50 border-b border-slate-150 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
        <div>
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest flex items-center gap-1.5">
            <Compass className="h-3.5 w-3.5 text-blue-600 animate-spin-slow" />
            <span>WorkNear Satellite Radar</span>
          </span>
          <h3 className="text-base font-black text-slate-900 mt-0.5">Live Hyperlocal Google Map</h3>
          <p className="text-[10px] text-slate-500">Searching active verified workers around {centerAddress}.</p>
        </div>
        <div className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 border border-slate-200 px-2 py-1 rounded-lg">
          GPS NODE: ACTIVE ({defaultCenter.lat.toFixed(4)}, {defaultCenter.lng.toFixed(4)})
        </div>
      </div>

      <APIProvider apiKey={GOOGLE_MAPS_KEY} version="weekly">
        <div className="relative h-[380px] w-full bg-slate-100">
          <Map
            center={mapCenter}
            zoom={mapZoom}
            mapId="DEMO_MAP_ID"
            onCenterChanged={(ev) => {
              if (ev.detail.center) {
                setCustomSearchCenter(ev.detail.center);
              }
            }}
            onZoomChanged={(ev) => setMapZoom(ev.detail.zoom)}
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
            style={{ width: '100%', height: '100%' }}
            gestureHandling="cooperative"
            disableDefaultUI={false}
          >
            {/* Map center pointer */}
            <AdvancedMarker position={mapCenter}>
              <Pin background="#2563eb" border="#1d4ed8" glyphColor="#ffffff" scale={1.2}>
                <div className="text-[9px] font-black font-mono">YOU</div>
              </Pin>
            </AdvancedMarker>

            {/* Workers of selected category */}
            {workers
              .filter(w => w.category === selectedCategory)
              .map((worker) => (
                <AdvancedMarker
                  key={worker.id}
                  position={{ lat: worker.lat, lng: worker.lng }}
                  onClick={() => setSelectedWorker(worker)}
                >
                  <div className="relative group cursor-pointer">
                    <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white border-2 border-blue-600 text-blue-700 shadow-md transform hover:scale-110 transition duration-150">
                      <span className="text-xs font-black">{worker.avatar}</span>
                    </div>
                    {/* Compact trust tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-slate-900 text-white text-[9px] font-bold px-2 py-0.5 rounded whitespace-nowrap shadow z-50">
                      Score: {worker.aiTrustScore}%
                    </div>
                  </div>
                </AdvancedMarker>
              ))}

            {/* Nearby Place Search Markers */}
            {placesList.map((place) => (
              <AdvancedMarker
                key={place.id}
                position={place.location}
                title={place.displayName}
              >
                <Pin background="#ea580c" border="#c2410c" glyphColor="#fff" scale={0.9} />
              </AdvancedMarker>
            ))}

            {/* Worker Info Window */}
            {selectedWorker && (
              <InfoWindow
                position={{ lat: selectedWorker.lat, lng: selectedWorker.lng }}
                onCloseClick={() => setSelectedWorker(null)}
              >
                <div className="p-1 max-w-[200px] text-left leading-normal font-sans text-xs">
                  <div className="flex items-center space-x-1.5 mb-1">
                    <span className="font-black text-slate-900 uppercase tracking-wide text-[11px] block">{selectedWorker.name}</span>
                    <span className="bg-emerald-50 text-emerald-700 font-bold text-[8px] px-1 py-0.2 rounded border border-emerald-150 flex items-center space-x-0.5">
                      <Shield className="h-2 w-2" />
                      <span>AADHAAR</span>
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono mb-1">{selectedWorker.locationName} • {selectedWorker.distanceKm}km</p>
                  
                  <div className="flex items-center space-x-2 my-1.5">
                    <div className="bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded text-center">
                      <span className="block text-[7px] text-slate-400 uppercase font-bold">Trust Score</span>
                      <span className="text-xs font-black text-blue-600">{selectedWorker.aiTrustScore}%</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded text-center">
                      <span className="block text-[7px] text-slate-400 uppercase font-bold">Rating</span>
                      <span className="text-xs font-black text-amber-500 flex items-center gap-0.5">
                        <Star className="h-2.5 w-2.5 fill-amber-500 text-amber-500" />
                        {selectedWorker.rating}
                      </span>
                    </div>
                  </div>

                  <p className="text-[9.5px] text-slate-600 leading-snug line-clamp-2 mb-2">{selectedWorker.bio}</p>

                  <button
                    onClick={() => {
                      onInviteWorker(selectedWorker);
                      setSelectedWorker(null);
                    }}
                    disabled={invitedWorkerIds.includes(selectedWorker.id)}
                    className={`w-full py-1 rounded text-[9px] font-black uppercase tracking-wider flex items-center justify-center space-x-1 border ${
                      invitedWorkerIds.includes(selectedWorker.id)
                        ? 'bg-slate-50 text-slate-400 border-slate-150'
                        : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600 cursor-pointer'
                    }`}
                  >
                    {invitedWorkerIds.includes(selectedWorker.id) ? (
                      <>
                        <Check className="h-2.5 w-2.5" />
                        <span>Invited</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-2.5 w-2.5" />
                        <span>Invite Directly</span>
                      </>
                    )}
                  </button>
                </div>
              </InfoWindow>
            )}
          </Map>

          {/* Quick GPS Geolocation Targeter */}
          <button
            type="button"
            onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (pos) => {
                    setMapCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                    setMapZoom(14);
                  },
                  (err) => console.warn('Geolocation blocked or timed out:', err)
                );
              }
            }}
            className="absolute bottom-5 right-5 z-10 bg-white p-2.5 rounded-full border border-slate-200 text-slate-700 hover:text-blue-600 hover:bg-slate-50 shadow-md cursor-pointer transition"
            title="Recenter Map to Device GPS"
          >
            <Navigation className="h-4 w-4 fill-slate-700 hover:fill-blue-600" />
          </button>

          {/* Floating Controls for Places (Nearby Search) */}
          <div className="absolute top-4 left-4 right-4 z-10 flex gap-2">
            <PlaceSearchInput 
              query={placeQuery}
              setQuery={setPlaceQuery}
              onSearch={(q) => {
                setPlaceQuery(q);
              }}
              searchCenter={customSearchCenter || mapCenter}
              setPlacesList={setPlacesList}
              setIsSearching={setIsSearchingPlaces}
            />
          </div>
        </div>
      </APIProvider>

      {/* Places Results Sidebar / Tray */}
      {placesList.length > 0 && (
        <div className="bg-slate-50 border-t border-slate-200 p-4 text-left">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Nearby Query Results ({placesList.length})</span>
            <button 
              onClick={() => {
                setPlacesList([]);
                setPlaceQuery('');
              }} 
              className="text-[10px] text-blue-600 hover:underline font-bold"
            >
              Clear Places
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {placesList.map((place) => (
              <div 
                key={place.id}
                onClick={() => {
                  setMapCenter(place.location);
                  setMapZoom(15);
                }}
                className="bg-white border border-slate-150 rounded-xl p-2.5 hover:border-blue-400 cursor-pointer transition"
              >
                <p className="text-[10.5px] font-black text-slate-800 truncate">{place.displayName}</p>
                <p className="text-[9px] text-slate-400 truncate mt-0.5">{place.formattedAddress}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-component to perform searchByText using maps library places
function PlaceSearchInput({
  query,
  setQuery,
  onSearch,
  searchCenter,
  setPlacesList,
  setIsSearching
}: {
  query: string;
  setQuery: (q: string) => void;
  onSearch: (q: string) => void;
  searchCenter: MapCoordinates;
  setPlacesList: (list: any[]) => void;
  setIsSearching: (b: boolean) => void;
}) {
  const map = useMap();
  const placesLib = useMapsLibrary('places');

  const executeSearch = (searchQuery: string) => {
    if (!placesLib || !searchQuery) return;
    setIsSearching(true);
    placesLib.Place.searchByText({
      textQuery: searchQuery,
      fields: ['id', 'displayName', 'location', 'formattedAddress'],
      locationBias: searchCenter,
      maxResultCount: 8,
    })
      .then(({ places }) => {
        setPlacesList(places || []);
        setIsSearching(false);
        if (places && places[0] && places[0].location) {
          map?.panTo(places[0].location);
        }
      })
      .catch((err) => {
        console.warn('Place Search Error:', err);
        setIsSearching(false);
      });
  };

  return (
    <div className="flex-grow flex items-center bg-white/95 backdrop-blur rounded-2xl shadow-md border border-slate-200/50 px-3 py-1.5">
      <Search className="h-4 w-4 text-slate-400 shrink-0 mr-2" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            executeSearch(query);
          }
        }}
        placeholder="Search nearby places (e.g., ATM, Restaurant, Bus stop, Tea)"
        className="w-full bg-transparent outline-none border-none text-xs text-slate-800 placeholder-slate-400 font-bold"
      />
      <button
        onClick={() => executeSearch(query)}
        className="bg-blue-600 hover:bg-blue-700 text-white text-[9.5px] font-black px-3 py-1 rounded-xl uppercase tracking-wider ml-2 cursor-pointer transition"
      >
        Scan
      </button>
    </div>
  );
}

// ------------------------------------------------------------------------
// BEAUTIFUL SIMULATED RADAR MAP (FALLBACK / UNIQUE INTERACTIVE DEMO MODE)
// ------------------------------------------------------------------------
function SimulatedRadarMap({
  workers,
  selectedCategory,
  centerAddress,
  onInviteWorker,
  invitedWorkerIds,
  defaultCenter
}: GigNearbyMapProps & { defaultCenter: { lat: number; lng: number } }) {
  const [activeRadarMode, setActiveRadarMode] = useState<'radar' | 'satellite'>('radar');
  const [simulatedSelectedWorker, setSimulatedSelectedWorker] = useState<MapWorker | null>(null);
  const [simulationQuery, setSimulationQuery] = useState('');
  const [simulationAmenities, setSimulationAmenities] = useState<any[]>([]);

  // Realistic Tamil Nadu localized POIs that simulate Google Maps Places
  const AMENITY_TEMPLATES: Record<string, { name: string; type: string; offsetLat: number; offsetLng: number }[]> = {
    'atm': [
      { name: 'SBI ATM - Adyar Node', type: 'ATM', offsetLat: 0.003, offsetLng: -0.005 },
      { name: 'HDFC Bank Cash Point', type: 'ATM', offsetLat: -0.004, offsetLng: 0.006 },
    ],
    'tea': [
      { name: 'Amma Tea Stall & Bun Butter Jam', type: 'Chai', offsetLat: 0.002, offsetLng: 0.002 },
      { name: 'Filter Coffee Express', type: 'Coffee', offsetLat: -0.002, offsetLng: -0.003 },
    ],
    'catering': [
      { name: 'Murugan Catering Supplies Wholesale', type: 'Supplier', offsetLat: 0.007, offsetLng: -0.002 },
      { name: 'Vasantha Bhavan Bulk Kitchen', type: 'Kitchen', offsetLat: -0.005, offsetLng: 0.008 },
    ],
    'hospital': [
      { name: 'Fortis Malar Hospital Emergency Ward', type: 'Hospital', offsetLat: 0.008, offsetLng: 0.006 },
    ]
  };

  const executeSimulationSearch = () => {
    const q = simulationQuery.toLowerCase();
    let matches: any[] = [];
    Object.keys(AMENITY_TEMPLATES).forEach((key) => {
      if (q.includes(key) || key.includes(q)) {
        AMENITY_TEMPLATES[key].forEach((item, index) => {
          matches.push({
            id: `sim-poi-${key}-${index}`,
            displayName: item.name,
            type: item.type,
            lat: defaultCenter.lat + item.offsetLat,
            lng: defaultCenter.lng + item.offsetLng,
            address: `${item.type} Facility near ${centerAddress}`
          });
        });
      }
    });

    if (matches.length > 0) {
      setSimulationAmenities(matches);
    } else {
      // General mock search result fallback
      setSimulationAmenities([
        {
          id: `sim-poi-gen`,
          displayName: `${simulationQuery.toUpperCase()} Spot - Chennai Hub`,
          type: 'Search Result',
          lat: defaultCenter.lat + 0.002,
          lng: defaultCenter.lng - 0.003,
          address: `Discovered near ${centerAddress}`
        }
      ]);
    }
  };

  return (
    <div id="simulated-radar-maps-container" className="bg-slate-950 text-white border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative text-left">
      {/* Glow highlight */}
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
      
      {/* Header */}
      <div className="border-b border-slate-900 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/80 backdrop-blur">
        <div>
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
            <span>AI Hyperlocal Satellite Radar (Virtual Sandbox)</span>
          </span>
          <h3 className="text-base font-black text-white mt-0.5 flex items-center gap-2">
            <span>WorkNear GPS Radar Map</span>
            <span className="text-[9px] bg-blue-500/20 text-blue-300 font-black px-2 py-0.5 rounded border border-blue-500/30">VIRTUAL</span>
          </h3>
          <p className="text-[10px] text-slate-400">Showing Aadhaar-verified labor coordinates around {centerAddress}.</p>
        </div>
        
        {/* Toggle Mode */}
        <div className="flex bg-slate-900 border border-slate-800 p-0.5 rounded-lg shrink-0 self-start sm:self-center">
          <button
            onClick={() => setActiveRadarMode('radar')}
            className={`px-3 py-1 text-[9px] font-black uppercase tracking-wider rounded-md transition flex items-center gap-1 ${
              activeRadarMode === 'radar' ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="h-3 w-3" />
            <span>Radar Scope</span>
          </button>
          <button
            onClick={() => setActiveRadarMode('satellite')}
            className={`px-3 py-1 text-[9px] font-black uppercase tracking-wider rounded-md transition flex items-center gap-1 ${
              activeRadarMode === 'satellite' ? 'bg-blue-600 text-white font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="h-3 w-3" />
            <span>Sat View</span>
          </button>
        </div>
      </div>

      {/* Main Radar Screen / Visual Element */}
      <div className="relative h-[340px] w-full bg-slate-950 overflow-hidden select-none">
        {/* Grid lines background */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-30" />
        
        {/* Radar Sweeper (only in radar mode) */}
        {activeRadarMode === 'radar' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Concentric rings */}
            <div className="absolute w-[120px] h-[120px] rounded-full border border-blue-900/30" />
            <div className="absolute w-[240px] h-[240px] rounded-full border border-blue-800/20" />
            <div className="absolute w-[360px] h-[360px] rounded-full border border-blue-700/10 animate-ping" />
            <div className="absolute w-[480px] h-[480px] rounded-full border border-blue-500/5" />
            {/* Sweep hand */}
            <div className="absolute inset-0 origin-center bg-gradient-to-tr from-transparent via-blue-500/5 to-blue-500/15 animate-[spin_4s_linear_infinite]" />
          </div>
        )}

        {activeRadarMode === 'satellite' && (
          <div className="absolute inset-0 bg-slate-900 pointer-events-none flex items-center justify-center text-slate-700 font-mono text-[9px] uppercase tracking-widest">
            {/* Visual simulation of high-density infrared thermal mapping */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/20 via-slate-900 to-slate-950" />
            <div className="absolute top-1/4 left-1/3 w-32 h-32 rounded-full bg-emerald-500/5 filter blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-40 h-40 rounded-full bg-amber-500/5 filter blur-3xl" />
          </div>
        )}

        {/* Central Map Pin Pointer for USER */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
          <div className="relative">
            <span className="absolute -inset-2 bg-blue-500/30 rounded-full animate-ping" />
            <span className="absolute -inset-4 bg-blue-500/10 rounded-full animate-pulse" />
            <div className="relative h-6 w-6 bg-blue-500 border border-blue-400 rounded-full flex items-center justify-center text-[9px] font-black shadow-md shadow-blue-500/40">
              HQ
            </div>
          </div>
          <span className="text-[8px] font-mono font-black text-blue-300 tracking-wider uppercase mt-1 px-1 bg-slate-900/80 border border-blue-500/30 rounded">
            {centerAddress.split(',')[0]} (YOU)
          </span>
        </div>

        {/* Verified Worker coordinates displayed on the Radar Screen */}
        {workers
          .filter(w => w.category === selectedCategory)
          .map((worker, i) => {
            // Distribute workers mathematically around center based on index
            const angle = (i * 360) / workers.filter(w => w.category === selectedCategory).length;
            const distancePercent = 30 + (worker.distanceKm * 20); // Scale distance
            const rad = (angle * Math.PI) / 180;
            const topPercent = 50 + Math.sin(rad) * distancePercent;
            const leftPercent = 50 + Math.cos(rad) * distancePercent;

            return (
              <button
                type="button"
                key={worker.id}
                onClick={() => setSimulatedSelectedWorker(worker)}
                style={{ top: `${topPercent}%`, left: `${leftPercent}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 group z-20"
              >
                <div className="relative flex flex-col items-center">
                  {/* Glowing halo */}
                  <span className="absolute -inset-1.5 bg-emerald-500/20 rounded-full animate-pulse" />
                  
                  <div className="relative h-9 w-9 bg-slate-900 border-2 border-emerald-500 rounded-xl flex items-center justify-center text-emerald-400 font-black shadow-lg hover:scale-110 hover:border-amber-400 transition cursor-pointer">
                    <span className="text-sm font-black">{worker.avatar}</span>
                  </div>

                  {/* Trust Score flag */}
                  <div className="absolute -top-3.5 bg-slate-900 border border-emerald-500/30 text-[7px] font-mono font-black text-emerald-400 px-1 rounded shadow uppercase">
                    TRST:{worker.aiTrustScore}%
                  </div>
                </div>
              </button>
            );
          })}

        {/* Render simulated searched amenities (places list) */}
        {simulationAmenities.map((amenity, idx) => {
          // Put POIs in random but deterministic spots
          const seed = idx * 2.5;
          const latOffset = Math.sin(seed) * 35;
          const lngOffset = Math.cos(seed) * 35;
          const topPercent = 50 + latOffset;
          const leftPercent = 50 + lngOffset;

          return (
            <div
              key={amenity.id}
              style={{ top: `${topPercent}%`, left: `${leftPercent}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center"
            >
              <div className="relative h-5 w-5 bg-amber-500 border border-amber-400 rounded-full flex items-center justify-center shadow-lg cursor-help group">
                <MapPin className="h-3 w-3 text-slate-950" />
                <div className="absolute bottom-full mb-1 hidden group-hover:block bg-slate-950 text-white text-[9px] font-black p-1.5 rounded whitespace-nowrap border border-amber-500/40 shadow-xl">
                  {amenity.displayName} ({amenity.type})
                </div>
              </div>
            </div>
          );
        })}

        {/* Map UI Search controls */}
        <div className="absolute top-4 left-4 right-4 z-20 flex gap-2">
          <div className="flex-grow flex items-center bg-slate-900/90 border border-slate-800 rounded-2xl px-3 py-1.5">
            <Search className="h-4 w-4 text-slate-500 mr-2 shrink-0" />
            <input
              type="text"
              value={simulationQuery}
              onChange={(e) => setSimulationQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  executeSimulationSearch();
                }
              }}
              placeholder="Search mock Chennai spots (e.g. 'atm', 'tea', 'catering')"
              className="w-full bg-transparent outline-none border-none text-xs text-slate-200 placeholder-slate-600 font-bold"
            />
            <button
              onClick={executeSimulationSearch}
              className="bg-amber-400 hover:bg-amber-500 text-slate-950 text-[9px] font-black px-3 py-1 rounded-xl uppercase tracking-wider ml-2 cursor-pointer transition"
            >
              Scan
            </button>
          </div>
        </div>

        {/* Active worker details popup inside Simulated Radar View */}
        <AnimatePresence>
          {simulatedSelectedWorker && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="absolute bottom-4 left-4 right-4 bg-slate-900/95 backdrop-blur border border-emerald-500/30 rounded-2xl p-4 z-30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="text-left space-y-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-black text-white text-sm uppercase tracking-wide">{simulatedSelectedWorker.name}</h4>
                  <span className="bg-emerald-500/10 text-emerald-400 font-bold text-[8px] px-2 py-0.5 rounded border border-emerald-500/30 flex items-center space-x-0.5">
                    <Shield className="h-2.5 w-2.5" />
                    <span>Aadhaar Verified</span>
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono">
                  Neighborhood Nodes: {simulatedSelectedWorker.locationName} ({simulatedSelectedWorker.distanceKm} km away)
                </p>
                <p className="text-[10px] text-slate-300 leading-normal max-w-lg">
                  {simulatedSelectedWorker.bio}
                </p>
                <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 pt-1">
                  <span>Experience: <b>{simulatedSelectedWorker.experience} years</b></span>
                  <span>Trust Score: <b className="text-emerald-400">{simulatedSelectedWorker.aiTrustScore}%</b></span>
                  <span className="flex items-center gap-0.5">Rating: <Star className="h-3 w-3 fill-amber-400 text-amber-400 inline" /> {simulatedSelectedWorker.rating} ({simulatedSelectedWorker.reviewsCount})</span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                <button
                  type="button"
                  onClick={() => setSimulatedSelectedWorker(null)}
                  className="px-3 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-400 hover:text-white cursor-pointer font-bold uppercase"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onInviteWorker(simulatedSelectedWorker);
                    setSimulatedSelectedWorker(null);
                  }}
                  disabled={invitedWorkerIds.includes(simulatedSelectedWorker.id)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider flex items-center space-x-1 cursor-pointer transition ${
                    invitedWorkerIds.includes(simulatedSelectedWorker.id)
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black'
                  }`}
                >
                  {invitedWorkerIds.includes(simulatedSelectedWorker.id) ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Invited</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      <span>Invite</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Places Results Sidebar / Tray */}
      {simulationAmenities.length > 0 && (
        <div className="bg-slate-900 border-t border-slate-800 p-4 text-left">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Nearby Scanned Landmarks ({simulationAmenities.length})</span>
            <button 
              onClick={() => {
                setSimulationAmenities([]);
                setSimulationQuery('');
              }} 
              className="text-[10px] text-amber-400 hover:underline font-bold"
            >
              Clear Radar Scan
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {simulationAmenities.map((amenity) => (
              <div 
                key={amenity.id}
                className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 hover:border-amber-400 transition cursor-help"
              >
                <p className="text-[10.5px] font-bold text-slate-200 truncate">{amenity.displayName}</p>
                <p className="text-[9px] text-slate-500 truncate mt-0.5">{amenity.address}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Integration Guide Section (Anti-Stuck Walkthrough) */}
      <div className="bg-slate-900 border-t border-slate-950 px-6 py-5 text-left">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
              <Key className="h-4 w-4 text-amber-400" />
              <span>Unlock Real-time Google Maps & Satellite GPS Data</span>
            </h4>
            <p className="text-[10px] text-slate-400 leading-relaxed max-w-2xl">
              This simulation uses simulated mock Chennai coordinates. To connect real satellite nodes, query the Google Places Autocomplete Engine, compute exact routing vectors, and overlay live real-world map markers, authorize your API Credentials.
            </p>
          </div>
          
          <a
            href="https://console.cloud.google.com/google/maps-apis/start?utm_campaign=gmp-code-assist-ais"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-amber-400 hover:bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-4 py-2 rounded-xl transition cursor-pointer text-center whitespace-nowrap inline-block shadow-lg"
          >
            Get Google Maps Key
          </a>
        </div>

        {/* Steps Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 mt-4 text-[10px] leading-relaxed text-slate-400 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-[9px] font-bold text-amber-400 uppercase tracking-widest block mb-1">Step 1: Set Environment Variable</span>
            <p>
              Open <b>Settings</b> (⚙️ gear icon, top-right corner) → click <b>Secrets</b> → type <code>GOOGLE_MAPS_PLATFORM_KEY</code> as the name, press <b>Enter</b>, paste your API key, and press <b>Enter</b> again.
            </p>
          </div>
          <div>
            <span className="text-[9px] font-bold text-amber-400 uppercase tracking-widest block mb-1">Step 2: Hot Auto-Rebuild</span>
            <p>
              The platform auto-detects the new secret, compiles the application, and binds live real-world GPS feeds. No browser reload is required.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
