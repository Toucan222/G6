import { supabase } from './supabase'

export async function updateStreak(userId: string) {
  const today = new Date().toISOString().split('T')[0]
  
  // Get current streak
  const { data: streakData } = await supabase
    .from('user_streaks')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (!streakData) {
    // Create first streak
    await supabase
      .from('user_streaks')
      .insert([{
        user_id: userId,
        current_streak: 1,
        longest_streak: 1,
        last_activity_date: today
      }])
    return
  }

  const lastActivity = new Date(streakData.last_activity_date)
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)

  let newStreak = streakData.current_streak

  if (lastActivity.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0]) {
    // Consecutive day
    newStreak += 1
  } else if (lastActivity.toISOString().split('T')[0] === today) {
    // Already logged today
    return
  } else {
    // Streak broken
    newStreak = 1
  }

  // Update streak
  await supabase
    .from('user_streaks')
    .update({
      current_streak: newStreak,
      longest_streak: Math.max(newStreak, streakData.longest_streak),
      last_activity_date: today
    })
    .eq('user_id', userId)

  // Check for streak badges
  const { data: badges } = await supabase
    .from('badges')
    .select('*')
    .eq('requirement_type', 'streak')
    .lte('requirement_value', newStreak)

  if (badges) {
    for (const badge of badges) {
      // Check if badge already earned
      const { data: existing } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', userId)
        .eq('badge_id', badge.id)
        .single()

      if (!existing) {
        // Award new badge
        await supabase
          .from('user_badges')
          .insert([{
            user_id: userId,
            badge_id: badge.id
          }])
      }
    }
  }
}

export async function checkAndAwardBadge(
  userId: string, 
  type: 'cards_created' | 'decks_created'
) {
  // Get count
  const { count } = await supabase
    .from(type === 'cards_created' ? 'cards' : 'decks')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  if (!count) return

  // Check for eligible badges
  const { data: badges } = await supabase
    .from('badges')
    .select('*')
    .eq('requirement_type', type)
    .lte('requirement_value', count)

  if (badges) {
    for (const badge of badges) {
      // Check if badge already earned
      const { data: existing } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', userId)
        .eq('badge_id', badge.id)
        .single()

      if (!existing) {
        // Award new badge
        await supabase
          .from('user_badges')
          .insert([{
            user_id: userId,
            badge_id: badge.id
          }])
      }
    }
  }
}
