#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// Use environment variables for Supabase credentials
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing environment variables. Please check your .env file contains:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL');
  console.error('   NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const createMockReport = async () => {
  const mockData = {
    case_number: `RPT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    report_type: 'incident',
    incident_type: ['burglary', 'theft', 'assault', 'vandalism', 'fraud'][Math.floor(Math.random() * 5)],
    incident_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    incident_time: `${Math.floor(Math.random() * 24).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
    location_address: ['123 Main St', '456 Oak Ave', '789 Pine Rd', '321 Elm Dr', '654 Maple St'][Math.floor(Math.random() * 5)],
    location_city: 'San Francisco',
    location_state: 'CA',
    location_zip: '94102',
    reporting_officer: ['Officer Johnson', 'Officer Smith', 'Officer Brown', 'Officer Davis'][Math.floor(Math.random() * 4)],
    report_narrative: `On the above date and time, I responded to a report of ${['suspicious activity', 'a disturbance', 'property damage', 'a theft'][Math.floor(Math.random() * 4)]} at the listed location. Upon arrival, I observed evidence consistent with the reported incident. Investigation is ongoing.`,
    vehicle_make: ['Honda', 'Toyota', 'Ford', 'Chevrolet', 'BMW'][Math.floor(Math.random() * 5)],
    vehicle_model: ['Civic', 'Camry', 'F-150', 'Silverado', 'X3'][Math.floor(Math.random() * 5)],
    vehicle_year: (2015 + Math.floor(Math.random() * 9)).toString(),
    vehicle_color: ['Black', 'White', 'Silver', 'Blue', 'Red'][Math.floor(Math.random() * 5)],
    vehicle_plate: `${Math.floor(Math.random() * 9)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 999).toString().padStart(3, '0')}`,
    vehicle_vin: `1HGBH41JXMN${Math.floor(Math.random() * 999999).toString().padStart(6, '0')}`,
    suspect_details: {
      first_name: ['John', 'Mike', 'David', 'Chris', 'Alex'][Math.floor(Math.random() * 5)],
      last_name: ['Doe', 'Smith', 'Johnson', 'Williams', 'Brown'][Math.floor(Math.random() * 5)],
      age: 18 + Math.floor(Math.random() * 42),
      gender: ['M', 'F'][Math.floor(Math.random() * 2)],
      height: `${5 + Math.floor(Math.random() * 2)}'${Math.floor(Math.random() * 12)}"`,
      weight: 120 + Math.floor(Math.random() * 120),
      hair_color: ['Brown', 'Black', 'Blonde', 'Red', 'Gray'][Math.floor(Math.random() * 5)],
      eye_color: ['Brown', 'Blue', 'Green', 'Hazel'][Math.floor(Math.random() * 4)]
    },
    photos: [],
    evidence_collected: []
  };

  const { data, error } = await supabase
    .from('incident_reports')
    .insert([mockData])
    .select();

  if (error) {
    console.error('❌ Error creating mock report:', error);
    return null;
  }

  console.log(`✅ Created incident report: ${mockData.case_number}`);
  return data[0];
};

const main = async () => {
  const count = parseInt(process.argv[2]) || 3;
  
  console.log(`🌱 Generating ${count} mock incident reports...`);
  
  for (let i = 0; i < count; i++) {
    await createMockReport();
  }
  
  console.log(`\n🎉 Successfully created ${count} mock incident reports!`);
  console.log('💡 You can now search for them in the search page.');
};

main().catch(console.error);