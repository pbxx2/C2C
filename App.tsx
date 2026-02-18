import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

type Tab = 'today' | 'social' | 'progress';

type Task = {
  id: string;
  name: string;
  points: number;
  completed: boolean;
};

type Friend = {
  id: string;
  handle: string;
  chadPercent: number;
  lastAction: string;
};

const starterTasks: Task[] = [
  { id: '1', name: 'Morning walk (20 min)', points: 15, completed: false },
  { id: '2', name: 'No doomscrolling before noon', points: 20, completed: false },
  { id: '3', name: 'Hydration target', points: 10, completed: false },
  { id: '4', name: 'Read 10 pages', points: 10, completed: false },
  { id: '5', name: 'Workout', points: 25, completed: false }
];

const starterFriends: Friend[] = [
  {
    id: '1',
    handle: 'gymrat_zoe',
    chadPercent: 88,
    lastAction: 'Finished Workout (+25)'
  },
  {
    id: '2',
    handle: 'mindfulmax',
    chadPercent: 104,
    lastAction: 'Hit daily goal. Chad day unlocked.'
  },
  {
    id: '3',
    handle: 'studykai',
    chadPercent: 63,
    lastAction: 'Completed Focus block (+15)'
  }
];

const historyWeek = [72, 95, 110, 55, 120, 100, 84];

export default function App() {
  const [tab, setTab] = useState<Tab>('today');
  const [dailyGoalInput, setDailyGoalInput] = useState('100');
  const [tasks, setTasks] = useState(starterTasks);

  const dailyGoal = Math.max(1, Number(dailyGoalInput) || 100);
  const pointsToday = useMemo(
    () => tasks.filter((task) => task.completed).reduce((sum, task) => sum + task.points, 0),
    [tasks]
  );

  const chadPercent = Math.floor((pointsToday / dailyGoal) * 100);
  const clampedProgress = Math.min(100, chadPercent);

  const averageWeek = Math.floor((historyWeek.reduce((sum, day) => sum + day, 0) + pointsToday) / 8);
  const goalsHitWeek = historyWeek.filter((p) => p >= dailyGoal).length + (pointsToday >= dailyGoal ? 1 : 0);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed
            }
          : task
      )
    );
  };

  const resetDay = () => {
    setTasks((prev) => prev.map((task) => ({ ...task, completed: false })));
  };

  const statusLabel =
    chadPercent >= 100
      ? 'Chad day'
      : chadPercent >= 80
      ? 'Almost Chad'
      : chadPercent >= 40
      ? 'Rising'
      : 'Chud zone';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <Text style={styles.title}>CTC</Text>
        <Text style={styles.subtitle}>Chud to Chad</Text>

        <View style={styles.tabBar}>
          <TabButton label="Today" active={tab === 'today'} onPress={() => setTab('today')} />
          <TabButton label="Social" active={tab === 'social'} onPress={() => setTab('social')} />
          <TabButton label="Progress" active={tab === 'progress'} onPress={() => setTab('progress')} />
        </View>

        {tab === 'today' && (
          <ScrollView contentContainerStyle={styles.screen}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Daily Goal</Text>
              <TextInput
                value={dailyGoalInput}
                onChangeText={setDailyGoalInput}
                keyboardType="number-pad"
                style={styles.input}
                placeholder="Set daily point goal"
                placeholderTextColor="#6f6d67"
              />
              <Text style={styles.caption}>Goal: {dailyGoal} points</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Today Score</Text>
              <Text style={styles.scoreText}>{pointsToday} pts</Text>
              <Text style={styles.statusText}>
                {chadPercent}% Chad | {statusLabel}
              </Text>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${clampedProgress}%` }]} />
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Tasks</Text>
              {tasks.map((task) => (
                <Pressable
                  key={task.id}
                  style={[styles.taskRow, task.completed && styles.taskDone]}
                  onPress={() => toggleTask(task.id)}
                >
                  <Text style={styles.taskName}>{task.name}</Text>
                  <Text style={styles.taskPoints}>+{task.points}</Text>
                </Pressable>
              ))}
              <Pressable style={styles.resetButton} onPress={resetDay}>
                <Text style={styles.resetButtonText}>Reset Day</Text>
              </Pressable>
            </View>
          </ScrollView>
        )}

        {tab === 'social' && (
          <ScrollView contentContainerStyle={styles.screen}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Friends Feed</Text>
              <Text style={styles.caption}>Add reactions and comments in next step.</Text>
              {starterFriends.map((friend) => (
                <View key={friend.id} style={styles.feedRow}>
                  <View>
                    <Text style={styles.friendHandle}>@{friend.handle}</Text>
                    <Text style={styles.feedAction}>{friend.lastAction}</Text>
                  </View>
                  <Text style={styles.friendPercent}>{friend.chadPercent}%</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        )}

        {tab === 'progress' && (
          <ScrollView contentContainerStyle={styles.screen}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Stats</Text>
              <StatRow label="Average points/day" value={`${averageWeek}`} />
              <StatRow label="Goals hit (last 8 days)" value={`${goalsHitWeek}/8`} />
              <StatRow label="Today points" value={`${pointsToday}`} />
              <StatRow label="Current Chad %" value={`${chadPercent}%`} />
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Weekly History (pts)</Text>
              <View style={styles.chipsWrap}>
                {historyWeek.map((points, idx) => (
                  <View key={idx} style={styles.chip}>
                    <Text style={styles.chipText}>{points}</Text>
                  </View>
                ))}
                <View style={[styles.chip, styles.chipToday]}>
                  <Text style={[styles.chipText, styles.chipTextToday]}>{pointsToday}</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

function TabButton({
  label,
  active,
  onPress
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={[styles.tab, active && styles.tabActive]} onPress={onPress}>
      <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
    </Pressable>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7f6f2'
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1f271b'
  },
  subtitle: {
    fontSize: 14,
    color: '#47524d',
    marginBottom: 12
  },
  tabBar: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12
  },
  tab: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bfd7b5',
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#edf3ea'
  },
  tabActive: {
    backgroundColor: '#2f6f3e',
    borderColor: '#2f6f3e'
  },
  tabText: {
    color: '#2f6f3e',
    fontWeight: '700'
  },
  tabTextActive: {
    color: '#f7f6f2'
  },
  screen: {
    paddingBottom: 24,
    gap: 12
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e6e7de'
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 10,
    color: '#1f271b'
  },
  input: {
    borderWidth: 1,
    borderColor: '#d6d8cd',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1f271b'
  },
  caption: {
    marginTop: 8,
    color: '#5f665d'
  },
  scoreText: {
    fontSize: 30,
    fontWeight: '800',
    color: '#2f6f3e'
  },
  statusText: {
    marginTop: 4,
    marginBottom: 10,
    color: '#435047',
    fontWeight: '600'
  },
  progressTrack: {
    height: 12,
    borderRadius: 999,
    backgroundColor: '#e9eee6',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1f7a4d'
  },
  taskRow: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e4e8db',
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  taskDone: {
    backgroundColor: '#edf8ef',
    borderColor: '#8fd19e'
  },
  taskName: {
    color: '#1f271b',
    flex: 1,
    marginRight: 8
  },
  taskPoints: {
    color: '#1f7a4d',
    fontWeight: '700'
  },
  resetButton: {
    marginTop: 6,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#1f271b',
    alignItems: 'center'
  },
  resetButtonText: {
    color: '#f7f6f2',
    fontWeight: '700'
  },
  feedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eceee6'
  },
  friendHandle: {
    fontWeight: '700',
    color: '#1f271b'
  },
  feedAction: {
    marginTop: 3,
    color: '#535f57'
  },
  friendPercent: {
    fontWeight: '800',
    color: '#2f6f3e'
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eceee6'
  },
  statLabel: {
    color: '#425047'
  },
  statValue: {
    color: '#1f271b',
    fontWeight: '700'
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#ecefe5'
  },
  chipToday: {
    backgroundColor: '#2f6f3e'
  },
  chipText: {
    color: '#1f271b',
    fontWeight: '700'
  },
  chipTextToday: {
    color: '#f7f6f2'
  }
});
