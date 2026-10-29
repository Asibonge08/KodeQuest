import alasql from 'alasql';

export interface SqlQueryResult {
  columns: string[];
  rows: any[];
  error?: string;
  rowCount: number;
}

// Initialize and seed sample Richfield Database
export function initRichfieldDatabase() {
  try {
    // Reset DB tables
    alasql('DROP TABLE IF EXISTS enrolments;');
    alasql('DROP TABLE IF EXISTS students;');
    alasql('DROP TABLE IF EXISTS campuses;');
    alasql('DROP TABLE IF EXISTS modules;');

    // 1. Campuses Table
    alasql(`
      CREATE TABLE campuses (
        campus_id INT PRIMARY KEY,
        name STRING,
        province STRING,
        is_metro BOOLEAN
      );
    `);

    alasql(`
      INSERT INTO campuses VALUES 
      (1, 'Umhlanga', 'KwaZulu-Natal', true),
      (2, 'Bryanston', 'Gauteng', true),
      (3, 'Centurion', 'Gauteng', true),
      (4, 'Cape Town', 'Western Cape', true),
      (5, 'Musgrave', 'KwaZulu-Natal', true),
      (6, 'Pretoria', 'Gauteng', true),
      (7, 'Newtown Junction', 'Gauteng', true),
      (8, 'Polokwane', 'Limpopo', false);
    `);

    // 2. Modules Table
    alasql(`
      CREATE TABLE modules (
        module_code STRING PRIMARY KEY,
        module_name STRING,
        nqf_level INT,
        credits INT,
        department STRING
      );
    `);

    alasql(`
      INSERT INTO modules VALUES
      ('PROG511', 'Programming 511', 5, 15, 'Programming'),
      ('WEB511', 'Web Technology 511', 5, 15, 'Programming'),
      ('NET511', 'Networks 511', 5, 10, 'Networks'),
      ('DBS621', 'Database Systems 621', 6, 10, 'Databases'),
      ('DBS600', 'Database Systems 600', 6, 10, 'Databases'),
      ('PROG621', 'Programming 621', 6, 15, 'Programming'),
      ('NET621', 'Networks 621', 6, 15, 'Networks'),
      ('BUA621', 'Business Analysis 621', 6, 15, 'Business Analysis'),
      ('CLD600', 'Cloud Computing 600', 6, 10, 'Cloud & AI'),
      ('MLN600', 'Machine Learning 600', 6, 10, 'Cloud & AI'),
      ('SEC700', 'Cyber Security 700', 7, 10, 'Cyber Security');
    `);

    // 3. Students Table
    alasql(`
      CREATE TABLE students (
        student_id STRING PRIMARY KEY,
        first_name STRING,
        last_name STRING,
        campus_id INT,
        programme STRING,
        stream STRING,
        enrolment_year INT
      );
    `);

    alasql(`
      INSERT INTO students VALUES
      ('RGI-88322-01', 'Alex', 'Dlamini', 1, 'DIT', 'Programming', 2026),
      ('RGI-88322-02', 'Sipho', 'Ndlovu', 1, 'DIT', 'Programming', 2025),
      ('RGI-88322-03', 'Chantelle', 'Van Zyl', 2, 'DIT', 'Network Engineering', 2025),
      ('RGI-88322-04', 'Amahle', 'Mthembu', 4, 'DIT', 'Business Analysis', 2026),
      ('RGI-12236-05', 'Tariq', 'Patel', 3, 'BSc_IT', 'Emerging Technologies', 2026),
      ('RGI-12236-06', 'Zanele', 'Khumalo', 6, 'BSc_IT', 'Programming', 2025),
      ('RGI-88322-07', 'Keagan', 'Pillay', 5, 'DIT', 'Programming', 2026),
      ('RGI-12236-08', 'Nomsa', 'Sithole', 8, 'BSc_IT', 'IT Management', 2026);
    `);

    // 4. Enrolments Table
    alasql(`
      CREATE TABLE enrolments (
        enrolment_id INT PRIMARY KEY,
        student_id STRING,
        module_code STRING,
        formative_score INT,
        summative_score INT,
        final_mark INT
      );
    `);

    alasql(`
      INSERT INTO enrolments VALUES
      (101, 'RGI-88322-01', 'PROG511', 80, 85, 83),
      (102, 'RGI-88322-01', 'DBS621', 75, 78, 77),
      (103, 'RGI-88322-02', 'PROG511', 90, 92, 91),
      (104, 'RGI-88322-02', 'NET511', 85, 88, 87),
      (105, 'RGI-88322-03', 'NET511', 92, 94, 93),
      (106, 'RGI-88322-04', 'BUA621', 88, 86, 87),
      (107, 'RGI-12236-05', 'CLD600', 84, 89, 87),
      (108, 'RGI-12236-06', 'PROG621', 70, 75, 73);
    `);
  } catch (err) {
    console.warn('Database initialization warning:', err);
  }
}

// Safe executor for in-browser student queries
export function executeStudentQuery(sql: string): SqlQueryResult {
  initRichfieldDatabase();
  try {
    const rawResult = alasql(sql);
    if (!Array.isArray(rawResult)) {
      return {
        columns: ['affected_rows'],
        rows: [{ affected_rows: typeof rawResult === 'number' ? rawResult : 1 }],
        rowCount: 1
      };
    }
    if (rawResult.length === 0) {
      return { columns: [], rows: [], rowCount: 0 };
    }
    const columns = Object.keys(rawResult[0]);
    return {
      columns,
      rows: rawResult,
      rowCount: rawResult.length
    };
  } catch (e: any) {
    return {
      columns: [],
      rows: [],
      error: e?.message || 'SQL Syntax Error',
      rowCount: 0
    };
  }
}

// Compare student query result against expected query result
export function verifySqlQuery(studentSql: string, expectedSql: string): { passed: boolean; message: string; studentRows?: any[]; expectedRows?: any[] } {
  initRichfieldDatabase();
  try {
    const studentRes = alasql(studentSql);
    const expectedRes = alasql(expectedSql);

    if (!Array.isArray(studentRes) || !Array.isArray(expectedRes)) {
      return { passed: false, message: 'Query must return a table result set.' };
    }

    if (studentRes.length !== expectedRes.length) {
      return {
        passed: false,
        message: `Row count mismatch: your query returned ${studentRes.length} rows, but expected ${expectedRes.length} rows.`,
        studentRows: studentRes,
        expectedRows: expectedRes
      };
    }

    // Compare content ignoring column order
    const normalize = (row: any) => JSON.stringify(Object.values(row).map(v => (typeof v === 'string' ? v.trim() : v)).sort());
    const studentSigs = studentRes.map(normalize).sort();
    const expectedSigs = expectedRes.map(normalize).sort();

    const matches = studentSigs.every((val, idx) => val === expectedSigs[idx]);
    if (!matches) {
      return {
        passed: false,
        message: 'The query produced rows, but values do not match expected criteria.',
        studentRows: studentRes,
        expectedRows: expectedRes
      };
    }

    return {
      passed: true,
      message: 'Query matched expected results successfully!',
      studentRows: studentRes,
      expectedRows: expectedRes
    };
  } catch (e: any) {
    return {
      passed: false,
      message: `SQL Execution Error: ${e?.message || 'Check SQL syntax'}`
    };
  }
}
