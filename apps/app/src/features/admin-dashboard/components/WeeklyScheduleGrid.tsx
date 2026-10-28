import { StyleSheet, Text, View } from 'react-native';

import { academicDays, dayLabels } from '@/features/academic/presentation';
import { dashboardColors } from '@/features/admin-dashboard/tokens';
import type { WeeklyScheduleClass } from '@/features/admin-dashboard/types';

const rowHeight = 92;
const timeColumnWidth = 96;

type ClassBlockProps = {
  classItem: WeeklyScheduleClass;
  gridStartHour: number;
};

function ClassBlock({ classItem, gridStartHour }: ClassBlockProps) {
  const top = (classItem.startHour - gridStartHour) * rowHeight;
  const height = (classItem.endHour - classItem.startHour) * rowHeight - 4;

  return (
    <View
      style={[
        styles.classBlock,
        {
          backgroundColor: classItem.backgroundColor,
          height,
          top
        }
      ]}
    >
      <View style={[styles.classAccent, { backgroundColor: classItem.accentColor }]} />
      <View style={styles.classCopy}>
        <Text style={[styles.classTitle, { color: classItem.accentColor }]}>
          {classItem.subject}
        </Text>
        <Text style={[styles.classMeta, { color: classItem.accentColor }]}>{classItem.time}</Text>
        <Text style={[styles.classMeta, { color: classItem.accentColor }]}>
          {classItem.location}
        </Text>
      </View>
    </View>
  );
}

export function WeeklyScheduleGrid({ classes }: { classes: WeeklyScheduleClass[] }) {
  const gridStartHour = Math.min(8, ...classes.map((item) => Math.floor(item.startHour)));
  const endHour = Math.max(17, ...classes.map((item) => Math.ceil(item.endHour)));
  const scheduleHours = Array.from(
    { length: endHour - gridStartHour },
    (_, index) => `${String(index + gridStartHour).padStart(2, '0')}:00`
  );
  const scheduleDays = academicDays
    .filter((day, index) => index < 5 || classes.some((item) => item.day === dayLabels[day]))
    .map((day) => dayLabels[day]);
  return (
    <View style={styles.gridCard}>
      <View style={styles.headerRow}>
        <Text style={styles.timeHeader}>HORA</Text>
        {scheduleDays.map((day) => (
          <Text key={day} style={styles.dayHeader}>
            {day}
          </Text>
        ))}
      </View>

      <View style={[styles.body, { minHeight: rowHeight * scheduleHours.length }]}>
        <View style={styles.timeColumn}>
          {scheduleHours.map((hour) => (
            <View key={hour} style={styles.timeSlot}>
              <Text style={styles.timeText}>{hour}</Text>
            </View>
          ))}
        </View>

        {scheduleDays.map((day) => {
          const dayClasses = classes.filter((classItem) => classItem.day === day);

          return (
            <View key={day} style={styles.dayColumn}>
              {scheduleHours.map((hour) => (
                <View key={`${day}-${hour}`} style={styles.gridLine} />
              ))}
              {dayClasses.map((classItem) => (
                <ClassBlock
                  classItem={classItem}
                  gridStartHour={gridStartHour}
                  key={classItem.id}
                />
              ))}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flexDirection: 'row',
    minHeight: rowHeight * 9
  },
  classAccent: {
    alignSelf: 'stretch',
    borderBottomLeftRadius: 6,
    borderTopLeftRadius: 6,
    width: 4
  },
  classBlock: {
    borderRadius: 6,
    flexDirection: 'row',
    left: 0,
    overflow: 'hidden',
    position: 'absolute',
    right: 0
  },
  classCopy: {
    justifyContent: 'center',
    paddingHorizontal: 10
  },
  classMeta: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0,
    marginTop: 7
  },
  classTitle: {
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0
  },
  dayColumn: {
    flex: 1,
    minWidth: 190,
    position: 'relative'
  },
  dayHeader: {
    color: dashboardColors.textPrimary,
    flex: 1,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0,
    minWidth: 190
  },
  gridCard: {
    backgroundColor: dashboardColors.card,
    borderColor: dashboardColors.border,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 28,
    minWidth: 1040,
    overflow: 'hidden'
  },
  gridLine: {
    borderTopColor: dashboardColors.border,
    borderTopWidth: 1,
    height: rowHeight
  },
  headerRow: {
    alignItems: 'center',
    borderBottomColor: dashboardColors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    height: 46,
    paddingRight: 8
  },
  timeColumn: {
    width: timeColumnWidth
  },
  timeHeader: {
    color: dashboardColors.textSecondary,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0,
    paddingLeft: 18,
    width: timeColumnWidth
  },
  timeSlot: {
    height: rowHeight,
    paddingLeft: 18,
    paddingTop: 16
  },
  timeText: {
    color: dashboardColors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0
  }
});
