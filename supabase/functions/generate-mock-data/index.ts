
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Mock data generators
const generateHeight = () => {
  const feet = Math.floor(Math.random() * (7 - 4) + 4)
  const inches = Math.floor(Math.random() * 12)
  return `${feet}'${inches}`
}

const generateWeight = () => Math.floor(Math.random() * (300 - 100) + 100)

const generateEyeColor = () => {
  const colors = ['Brown', 'Blue', 'Green', 'Hazel', 'Gray']
  return colors[Math.floor(Math.random() * colors.length)]
}

const generateHairColor = () => {
  const colors = ['Black', 'Brown', 'Blonde', 'Red', 'Gray', 'White']
  return colors[Math.floor(Math.random() * colors.length)]
}

const generateCaliforniaPenalCode = () => {
  const penalCodes = [
    { code: '187(a) PC', description: 'Murder' },
    { code: '211 PC', description: 'Robbery' },
    { code: '245(a)(1) PC', description: 'Assault with a Deadly Weapon' },
    { code: '459 PC', description: 'Burglary' },
    { code: '487 PC', description: 'Grand Theft' },
    { code: '496(a) PC', description: 'Receiving Stolen Property' },
    { code: '422 PC', description: 'Criminal Threats' },
    { code: '243(e)(1) PC', description: 'Domestic Battery' },
    { code: '470(a) PC', description: 'Forgery' },
    { code: '503 PC', description: 'Embezzlement' }
  ]
  return penalCodes[Math.floor(Math.random() * penalCodes.length)]
}

const generateVehicle = () => {
  const makes = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'Nissan', 'BMW', 'Mercedes']
  const colors = ['Black', 'White', 'Silver', 'Red', 'Blue', 'Gray']
  const currentYear = new Date().getFullYear()
  
  return {
    make: makes[Math.floor(Math.random() * makes.length)],
    model: 'Model ' + Math.floor(Math.random() * 5 + 1),
    year: Math.floor(Math.random() * 20 + (currentYear - 20)).toString(),
    color: colors[Math.floor(Math.random() * colors.length)],
    vin: 'VIN' + Math.random().toString(36).substring(2, 15),
    plate: Math.random().toString(36).substring(2, 8).toUpperCase(),
  }
}

const generatePerson = (type: 'victim' | 'suspect') => {
  const firstNames = ['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Mary', 'Patricia', 'Jennifer', 'Linda']
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez']
  
  return {
    firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
    lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
    dob: new Date(Math.floor(Math.random() * (Date.now() - new Date('1950-01-01').getTime())) + new Date('1950-01-01').getTime()).toISOString().split('T')[0],
    gender: Math.random() > 0.5 ? 'Male' : 'Female',
    height: generateHeight(),
    weight: generateWeight(),
    hairColor: generateHairColor(),
    eyeColor: generateEyeColor(),
    address: `${Math.floor(Math.random() * 9999)} Main St, Los Angeles, CA ${Math.floor(Math.random() * 89999 + 10000)}`,
    ...(type === 'suspect' && {
      charges: generateCaliforniaPenalCode(),
      inCustody: Math.random() > 0.5,
      arrestHistory: Math.random() > 0.7 ? 'Prior arrests for similar offenses' : 'No prior arrests',
    })
  }
}

const generateFingerprint = () => {
  const array = new Uint8Array(1024);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode.apply(null, [...array]));
}

const generateFingerprintQuality = () => Math.floor(Math.random() * 30) + 70; // 70-100 quality score

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Create Supabase client using environment variables
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const victim = generatePerson('victim')
    const suspect = generatePerson('suspect')
    const vehicle = generateVehicle()
    const incidentDate = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
    
    // Randomly choose between robbery and homicide
    const penalCode = Math.random() > 0.5 ? '211' : '187';
    const crimeDescription = penalCode === '187' 
      ? `Homicide incident involving victim ${victim.firstName} ${victim.lastName}`
      : `Armed robbery incident involving ${victim.firstName} ${victim.lastName}`;

    // Create incident report
    const { data: report, error: reportError } = await supabase
      .from('incident_reports')
      .insert([
        {
          incident_date: incidentDate.toISOString(),
          incident_description: crimeDescription,
          penal_code: penalCode,
          vehicle_make: vehicle.make,
          vehicle_model: vehicle.model,
          vehicle_year: vehicle.year,
          vehicle_color: vehicle.color,
          vehicle_vin: vehicle.vin,
          vehicle_plate: vehicle.plate,
          location_address: `${Math.floor(Math.random() * 9999)} ${['Main', 'First', 'Second', 'Third', 'Fourth'][Math.floor(Math.random() * 5)]} St, Los Angeles, CA`,
          victim_details: {
            first_name: victim.firstName,
            last_name: victim.lastName,
            dob: victim.dob,
            gender: victim.gender,
            height: victim.height,
            weight: victim.weight,
            hair: victim.hairColor,
            eyes: victim.eyeColor,
            address: victim.address
          },
          suspect_details: {
            first_name: suspect.firstName,
            last_name: suspect.lastName,
            dob: suspect.dob,
            gender: suspect.gender,
            height: suspect.height,
            weight: suspect.weight,
            hair: suspect.hairColor,
            eyes: suspect.eyeColor,
            address: suspect.address,
            charges: suspect.charges.code,
            in_custody: suspect.inCustody,
            arrest_history: suspect.arrestHistory
          }
        }
      ])
      .select()
      .single()

    if (reportError) {
      throw reportError
    }

    // Generate fingerprint scans for the suspect (if in custody)
    if (suspect.inCustody) {
      const fingerPositions = [
        'right_thumb', 'right_index', 'right_middle', 'right_ring', 'right_little',
        'left_thumb', 'left_index', 'left_middle', 'left_ring', 'left_little'
      ];

      // Generate fingerprint scans for each finger
      const fingerprintScans = fingerPositions.map(position => ({
        incident_report_id: report.id,
        scan_data: generateFingerprint(),
        finger_position: position,
        scan_quality: generateFingerprintQuality(),
        scan_date: new Date().toISOString()
      }));

      const { error: fingerprintError } = await supabase
        .from('fingerprint_scans')
        .insert(fingerprintScans);

      if (fingerprintError) {
        console.error('Error creating fingerprint scans:', fingerprintError);
      }
    }

    // If it's a homicide case, generate an AI crime scene photo
    if (penalCode === '187') {
      try {
        const response = await fetch(
          `${Deno.env.get('SUPABASE_URL')}/functions/v1/generate-crime-scene`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              penal_code: penalCode,
              incident_report_id: report.id
            })
          }
        );

        if (!response.ok) {
          console.error('Failed to generate crime scene photo:', await response.text());
        }
      } catch (error) {
        console.error('Error generating crime scene photo:', error);
      }
    }

    // If suspect is in custody, create arrest tag and generate mugshot
    if (suspect.inCustody) {
      const { data: arrestTag, error: arrestError } = await supabase
        .from('arrest_tags')
        .insert([
          {
            incident_report_id: report.id,
            suspect_name: `${suspect.firstName} ${suspect.lastName}`,
            charges: `${suspect.charges.code} - ${suspect.charges.description}`,
            processing_status: 'pending'
          }
        ])
        .select()
        .single();

      if (arrestError) {
        console.error('Error creating arrest tag:', arrestError);
      } else {
        // Generate mugshot
        try {
          const response = await fetch(
            `${Deno.env.get('SUPABASE_URL')}/functions/v1/generate-mugshot`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                suspect_name: `${suspect.firstName} ${suspect.lastName}`,
                arrest_tag_id: arrestTag.id
              })
            }
          );

          if (!response.ok) {
            console.error('Failed to generate mugshot:', await response.text());
          }
        } catch (error) {
          console.error('Error generating mugshot:', error);
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: { 
          report_id: report.id,
          case_number: report.case_number
        } 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
