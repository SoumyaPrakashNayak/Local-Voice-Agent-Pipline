import { CaseRecord, Evidence, Entity } from './types';

export const intelligenceService = {
  analyzeFIR: async (narrative: string) => {
    // Artificial delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const extractedEntities: Entity[] = [];
    if (narrative.includes('9876543210')) {
      extractedEntities.push({ id: `ENT-${Date.now()}`, type: 'PHONE', value: '9876543210' });
    }
    
    // Always extract some dummy entities for demo
    extractedEntities.push({ id: `ENT-${Date.now()+1}`, type: 'LOCATION', value: '100ft Road' });

    return {
      crimeClassification: 'Residential Burglary',
      bnsProvisions: ['BNS 305 (Theft in dwelling house)', 'BNS 331 (House-trespass)'],
      bnssProcedures: ['BNSS 173 (Information in cognizable cases)', 'BNSS 176 (Investigation procedure)'],
      recommendedActions: [
        'Obtain nearby CCTV footage',
        'Identify suspicious vehicles in the area',
        'Check similar incidents in neighboring stations',
      ],
      crimeSignature: ['residential target', 'night occurrence', 'forced entry'],
      extractedEntities,
    };
  },

  scanCrossStationRelationships: async (entities: Entity[], currentStationId: string, allCases: CaseRecord[]) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    for (const entity of entities) {
      if (entity.value === '9876543210') {
        // Look for this entity in other stations' cases
        const matchingCase = allCases.find(
          (c) => c.stationId !== currentStationId && c.entities.some((e) => e.value === entity.value)
        );
        
        if (matchingCase) {
          return {
            matchFound: true,
            targetCaseId: matchingCase.id,
            targetStationId: matchingCase.stationId,
            confidence: 96,
            reason: `Same mobile number (${entity.value}) detected.`,
          };
        }
      }
    }
    return { matchFound: false };
  },

  processEvidence: async (description: string) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    const entities: Entity[] = [];
    if (description.toLowerCase().includes('9876543210')) {
      entities.push({ id: `ENT-${Date.now()}`, type: 'PHONE', value: '9876543210' });
    }
    if (description.toLowerCase().includes('ka-01')) {
      entities.push({ id: `ENT-${Date.now()+1}`, type: 'VEHICLE', value: 'KA-01-AB-1234' });
    }
    
    return {
      entitiesExtracted: entities,
      summary: 'Evidence analyzed successfully. Entities extracted for intelligence graph.',
    };
  },
};
