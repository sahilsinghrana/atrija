import json
with open('.hermes/kanban.json', 'r') as f:
    data = json.load(f)

backlog = data['columns'][0]['tasks']

def get_priority(task):
    cat = task['category']
    pri = task['priority']
    if cat in ['Testing & Reliability', 'Performance Optimizations']:
        group = 1
    elif cat == '3D Elements':
        group = 2
    else:
        group = 3
    if pri == 'high':
        level = 1
    elif pri == 'medium':
        level = 2
    else:  # low
        level = 3
    return (group, level, task['id'])

backlog.sort(key=get_priority)
data['columns'][0]['tasks'] = backlog

with open('.hermes/kanban.json', 'w') as f:
    json.dump(data, f, indent=2)