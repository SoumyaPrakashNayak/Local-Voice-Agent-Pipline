import { CaseRecord, Evidence, Entity } from './types';

export const intelligenceService = {
  analyzeFIR: async (narrative: string) => {
    // Artificial delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const extractedEntities: Entity[] = [];
    if (narrative.includes('9876543210')) {
      extractedEntities.push({ id: `ENT-${Date.now()}`, type: 'PHONE', value: '+91-9876543210' });
    }
    
    // Always extract some demo entities
    extractedEntities.push({ id: `ENT-${Date.now()+1}`, type: 'LOCATION', value: 'Bhubaneswar' });

    return {
      crimeClassification: 'Residential Burglary',
      bnsProvisions: ['BNS 305 (Theft in dwelling house)', 'BNS 331 (House-trespass)'],
      bnssProcedures: ['BNSS 173 (Information in cognizable cases)', 'BNSS 176 (Investigation procedure)'],
      recommendedActions: [
        'Obtain nearby CCTV footage',
        'Identify suspicious vehicles in the area',
        'Check similar incidents in neighboring Odisha Police stations',
      ],
      crimeSignature: ['residential target', 'night occurrence', 'forced entry'],
      extractedEntities,
    };
  },

  scanCrossStationRelationships: async (entities: Entity[], currentStationId: string, allCases: CaseRecord[]) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    for (const entity of entities) {
      // Match on phone number or Odisha vehicle plate
      if (entity.value === '+91-9876543210' || entity.value === 'OD-02-AB-1234') {
        const matchingCase = allCases.find(
          (c) => c.stationId !== currentStationId && c.entities.some((e) => e.value === entity.value)
        );
        
        if (matchingCase) {
          return {
            matchFound: true,
            targetCaseId: matchingCase.id,
            targetStationId: matchingCase.stationId,
            confidence: 96,
            reason: `Same ${entity.type === 'PHONE' ? 'mobile number' : 'vehicle registration'} (${entity.value}) detected across Odisha Police stations.`,
          };
        }
      }
    }

    // Also check any shared entity value across stations
    for (const entity of entities) {
      const matchingCase = allCases.find(
        (c) => c.stationId !== currentStationId && c.entities.some((e) => e.value === entity.value)
      );
      if (matchingCase) {
        return {
          matchFound: true,
          targetCaseId: matchingCase.id,
          targetStationId: matchingCase.stationId,
          confidence: 88,
          reason: `Matching ${entity.type} entity (${entity.value}) found across stations.`,
        };
      }
    }

    return { matchFound: false };
  },

  processEvidence: async (description: string) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    const entities: Entity[] = [];
    if (description.toLowerCase().includes('9876543210')) {
      entities.push({ id: `ENT-${Date.now()}`, type: 'PHONE', value: '+91-9876543210' });
    }
    if (description.toLowerCase().includes('od-02') || description.toLowerCase().includes('od-') || description.toLowerCase().includes('vehicle')) {
      entities.push({ id: `ENT-${Date.now()+1}`, type: 'VEHICLE', value: 'OD-02-AB-1234' });
    }
    
    return {
      entitiesExtracted: entities,
      summary: 'Evidence analyzed successfully. Entities extracted for Odisha Police intelligence graph.',
    };
  },
};
