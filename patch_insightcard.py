import os
p = os.path.expanduser('~/Downloads/sirat-capacitor-3/src/components/home/InsightCard.jsx')
t = open(p).read()

old_imp = 'import Icon from "../common/Icon";\nimport { getDailyInsight } from "../../services/insights";'
new_imp = 'import Icon from "../common/Icon";\nimport { getDailyInsight } from "../../services/insights";\nimport { useBranch } from "../../hooks/useBranch";'

if old_imp in t and 'useBranch' not in t:
    t = t.replace(old_imp, new_imp)
    print("✓ useBranch import added")
elif 'useBranch' in t:
    print("• useBranch already imported")
else:
    print("✗ couldn't find insights import — add useBranch manually")

old_call = 'export default function InsightCard() {\n  const insight = getDailyInsight();'
new_call = 'export default function InsightCard() {\n  const { branch } = useBranch();\n  const insight = getDailyInsight(branch || "sunni");'

if old_call in t:
    t = t.replace(old_call, new_call)
    print("✓ branch passed to getDailyInsight")
elif 'getDailyInsight(branch' in t:
    print("• branch already wired")
else:
    print("✗ couldn't find getDailyInsight() call — wire manually")

open(p, 'w').write(t)
print("done")
