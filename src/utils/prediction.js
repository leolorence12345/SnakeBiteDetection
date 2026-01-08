import { LOCATION_OPTIONS, TIME, SEASON, PLACE, LOCAL_SYMPTOMS, SYSTEMATIC_SYMPTOMS } from '../metadata';

export function combineSymptomValues(selected, reference) {
    if (!selected || selected.length === 0 || selected.includes("No Symptoms")) {
        return [0, 0, 0, 0];
    }
    let out = null;
    for (const sym of selected) {
        const val = reference[sym] || [0, 0, 0, 0];
        out = val.map((v, i) => (out ? out[i] : 0) + v);
    }
    return out || [0, 0, 0, 0];
}

export function mapHourToTimeCategory(hour) {
    if (hour >= 4 && hour < 9) {
        return "Early Morning";
    } else if (hour >= 9 && hour < 16) {
        return "During the day";
    } else if (hour >= 16 && hour < 20) {
        return "Evening";
    } else {
        return "Night";
    }
}

export function mapMonthToSeason(month) {
    if ([12, 1, 2].includes(month)) return "Winter";
    else if ([3, 4, 5].includes(month)) return "Summer";
    else if ([6, 7, 8].includes(month)) return "Monsoon";
    else if ([9, 10].includes(month)) return "Autumn";
    else return "Spring";
}

export function predictSnakeSpecies(formData) {
    const weights = [0.8, 0.4, 0.4, 0.5, 0.6, 0.8];
    const vectors = [];
    
    const { district, timeKey, seasonKey, place, localSymptoms, sysSymptoms, hasImage } = formData;
    
    if (district) {
        const districtUpper = district.toUpperCase();
        const locationVector = LOCATION_OPTIONS[districtUpper] || [0, 0, 0, 0];
        vectors.push(locationVector);
    }
    
    if (timeKey && TIME[timeKey]) {
        vectors.push(TIME[timeKey]);
    }
    
    if (seasonKey && SEASON[seasonKey]) {
        vectors.push(SEASON[seasonKey]);
    }
    
    if (place && PLACE[place]) {
        vectors.push(PLACE[place]);
    } else if (place) {
        vectors.push([0, 0, 0, 0]);
    }
    
    if (localSymptoms && localSymptoms.length > 0) {
        vectors.push(combineSymptomValues(localSymptoms, LOCAL_SYMPTOMS));
    }
    
    if (sysSymptoms && sysSymptoms.length > 0) {
        vectors.push(combineSymptomValues(sysSymptoms, SYSTEMATIC_SYMPTOMS));
    }
    
    const labels = ["Monocled Cobra", "Spectacled Cobra", "Russell's Viper", "Krait Species"];
    
    if (vectors.length === 0) {
        if (hasImage) {
            return labels[Math.floor(Math.random() * labels.length)];
        }
        return "Insufficient Input";
    }
    
    // Calculate scores
    const scores = [];
    for (let i = 0; i < 4; i++) {
        let score = 0;
        for (let j = 0; j < vectors.length; j++) {
            if (vectors[j] && vectors[j][i] !== undefined) {
                score += vectors[j][i] * (weights[j] || 1);
            }
        }
        scores.push(score);
    }
    
    const total = scores.reduce((sum, val) => sum + val, 0);
    
    if (total === 0) {
        return labels[Math.floor(Math.random() * labels.length)];
    }
    
    const probs = scores.map(v => (v / total) * 100);
    const maxIndex = probs.indexOf(Math.max(...probs));
    
    return labels[maxIndex];
}


