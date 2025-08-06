import { useMemo } from "react";
import { Goal } from "@/services/api";
import { GoalSummaryRow } from "@/components/goals/GoalSummaryRow";
import { useApi } from "@/hooks/useApi";
import { apiClient } from "@/services/api";

export default function GoalSummarySection() {
  const { data } = useApi<Goal[]>(() => apiClient.getGoals(), []);
  const goals = data || [];

  return (
    <GoalSummaryRow
      goals={goals}
      onClickAll={() => document.getElementById('goal-cards')?.scrollIntoView({ behavior: 'smooth'})}
      onClickCompleted={() => document.getElementById('goal-cards')?.scrollIntoView({ behavior: 'smooth'})}
      onClickInProgress={() => document.getElementById('goal-cards')?.scrollIntoView({ behavior: 'smooth'})}
      onClickNear={() => {
        const first = goals.find(g => g.deadline && Math.ceil((new Date(g.deadline!).getTime() - Date.now())/(1000*60*60*24)) <= 7);
        if (first) {
          document.getElementById(`goal-${first.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          document.getElementById('goal-cards')?.scrollIntoView({ behavior: 'smooth'})
        }
      }}
    />
  );
}
