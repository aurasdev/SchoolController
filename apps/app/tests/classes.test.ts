import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  CLASS_CSV_TEMPLATE,
  parseClassCsv,
  validateClassInput
} from '../src/features/classes/classCsv';
import {
  emptyClassFilters,
  filterClasses,
  getClassPageNumbers,
  paginateClasses
} from '../src/features/classes/classFilters';
import { initialClasses } from '../src/features/classes/content';

test('class filters combine teacher, department, status and a trimmed case-insensitive search', () => {
  assert.equal(initialClasses.length, 8);
  assert.equal(filterClasses(initialClasses, emptyClassFilters).length, 8);
  assert.equal(filterClasses(initialClasses, { ...emptyClassFilters, activeOnly: true }).length, 6);
  assert.equal(filterClasses(initialClasses, { ...emptyClassFilters, tab: 'pending' }).length, 2);
  assert.deepEqual(
    filterClasses(initialClasses, {
      ...emptyClassFilters,
      search: '  JOHNSON  ',
      department: 'Science & Math',
      teacherId: 'johnson',
      activeOnly: true,
      tab: 'active'
    }).map((academicClass) => academicClass.name),
    ['Mathematics 101']
  );
  assert.deepEqual(
    filterClasses(initialClasses, { ...emptyClassFilters, activeOnly: true, tab: 'pending' }),
    []
  );
});

test('pagination clamps a removed last page and handles empty results', () => {
  const classes = [...initialClasses, { ...initialClasses[0], id: 'ninth' }];
  const page = paginateClasses(classes, 2);

  assert.equal(page.items.length, 1);
  assert.equal(page.from, 9);
  assert.equal(page.to, 9);
  assert.equal(page.total, 9);
  assert.equal(paginateClasses(initialClasses, 2).page, 1);
  assert.deepEqual(paginateClasses([], 7), {
    from: 0,
    to: 0,
    items: [],
    page: 1,
    pageCount: 1,
    total: 0
  });
  assert.deepEqual(getClassPageNumbers(1, 6), [1, 2, 3, 4, 5, 6]);
  assert.deepEqual(getClassPageNumbers(5, 10), [1, 'ellipsis', 4, 5, 6, 'ellipsis', 10]);
});

test('CSV accepts BOM, CRLF, reordered headers, teacher IDs and blank lines', () => {
  const source =
    '\uFEFFstatus,students,schedule,teacher,department,name\r\n\r\nACTIVE,0,Mon 08:00,johnson,science & math,Algebra\r\n';

  assert.deepEqual(parseClassCsv(source), [
    {
      name: 'Algebra',
      department: 'Science & Math',
      teacherId: 'johnson',
      schedule: 'Mon 08:00',
      students: 0,
      status: 'active'
    }
  ]);
  assert.equal(parseClassCsv(CLASS_CSV_TEMPLATE)[0].teacherId, 'johnson');
});

test('CSV preserves escaped quotes, commas and embedded newlines', () => {
  const source =
    'name,department,teacher,schedule,students,status\n"Art, ""Advanced""",Arts,Mrs. Chen,"Mon 08:00\r\nWed 10:00",10,pending';
  const [academicClass] = parseClassCsv(source);

  assert.equal(academicClass.name, 'Art, "Advanced"');
  assert.equal(academicClass.schedule, 'Mon 08:00\nWed 10:00');
});

test('CSV rejects malformed structure and invalid rows before returning any imports', () => {
  for (const suffix of [
    'Bad,Arts,Unknown,Mon 08:00,10,active',
    'Bad,Arts,Mrs. Chen,Mon 08:00,-1,active',
    'Bad,Arts,Mrs. Chen,Mon 08:00,1.5,active',
    'Bad,Arts,Mrs. Chen,Mon 08:00,10001,active',
    'Bad,Arts,Mrs. Chen,Mon 08:00,,active',
    'Bad,Arts,Mrs. Chen,Mon 08:00,9007199254740992,active',
    'Bad,Arts,Mrs. Chen,Mon 08:00,10,unknown',
    'Bad,Unknown,Mrs. Chen,Mon 08:00,10,active',
    '"Bad,Arts,Mrs. Chen,Mon 08:00,10,active',
    '"Bad"extra,Arts,Mrs. Chen,Mon 08:00,10,active',
    'Bad,Arts,Mrs. Chen,Mon 08:00,10,active,extra'
  ]) {
    assert.throws(() => parseClassCsv(`${CLASS_CSV_TEMPLATE}${suffix}`), /CSV line 3:/);
  }

  assert.throws(() => parseClassCsv(''), /empty/);
  assert.throws(() => parseClassCsv('name,name,teacher,schedule,students,status'), /headers/);
  assert.throws(
    () => parseClassCsv('name,department,teacher,schedule,students,status'),
    /no classes/
  );
  assert.deepEqual(validateClassInput(parseClassCsv(CLASS_CSV_TEMPLATE)[0]), {});
});
