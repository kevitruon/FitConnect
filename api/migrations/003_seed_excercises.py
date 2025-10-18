steps = [
    [
        # "Up" SQL statement
        """
        INSERT INTO exercises (exercise_name, description, category) VALUES
        -- Chest Exercises
        ('Bench Press', 'Barbell bench press for chest development', 'Chest'),
        ('Incline Bench Press', 'Incline barbell bench press targeting upper chest', 'Chest'),
        ('Decline Bench Press', 'Decline barbell bench press targeting lower chest', 'Chest'),
        ('Dumbbell Bench Press', 'Dumbbell bench press for chest', 'Chest'),
        ('Dumbbell Flyes', 'Chest isolation exercise using dumbbells', 'Chest'),
        ('Cable Flyes', 'Cable chest flyes for chest isolation', 'Chest'),
        ('Push-Ups', 'Bodyweight chest exercise', 'Chest'),
        ('Chest Dips', 'Bodyweight exercise targeting chest and triceps', 'Chest'),
        ('Pec Deck Machine', 'Machine chest flyes', 'Chest'),

        -- Back Exercises
        ('Deadlift', 'Compound exercise for overall back development', 'Back'),
        ('Barbell Row', 'Bent-over barbell row for back thickness', 'Back'),
        ('T-Bar Row', 'T-bar row for back development', 'Back'),
        ('Dumbbell Row', 'Single-arm dumbbell row for back', 'Back'),
        ('Pull-Ups', 'Bodyweight exercise for back width', 'Back'),
        ('Chin-Ups', 'Underhand pull-up variation', 'Back'),
        ('Lat Pulldown', 'Machine exercise for back width', 'Back'),
        ('Seated Cable Row', 'Cable row for back thickness', 'Back'),
        ('Face Pulls', 'Cable exercise for rear delts and upper back', 'Back'),
        ('Hyperextensions', 'Lower back extension exercise', 'Back'),

        -- Shoulder Exercises
        ('Overhead Press', 'Standing or seated barbell shoulder press', 'Shoulders'),
        ('Dumbbell Shoulder Press', 'Seated or standing dumbbell press', 'Shoulders'),
        ('Arnold Press', 'Rotating dumbbell shoulder press', 'Shoulders'),
        ('Lateral Raises', 'Dumbbell lateral raises for side delts', 'Shoulders'),
        ('Front Raises', 'Dumbbell front raises for front delts', 'Shoulders'),
        ('Rear Delt Flyes', 'Dumbbell rear delt flyes', 'Shoulders'),
        ('Upright Row', 'Barbell upright row for shoulders', 'Shoulders'),
        ('Shrugs', 'Barbell or dumbbell shrugs for traps', 'Shoulders'),
        ('Cable Lateral Raises', 'Cable lateral raises for side delts', 'Shoulders'),

        -- Arm Exercises - Biceps
        ('Barbell Curl', 'Standing barbell bicep curl', 'Arms'),
        ('Dumbbell Curl', 'Alternating or simultaneous dumbbell curls', 'Arms'),
        ('Hammer Curl', 'Neutral grip dumbbell curl', 'Arms'),
        ('Preacher Curl', 'Barbell or dumbbell preacher curl', 'Arms'),
        ('Cable Curl', 'Cable bicep curl', 'Arms'),
        ('Concentration Curl', 'Single-arm seated dumbbell curl', 'Arms'),
        ('EZ-Bar Curl', 'EZ-bar bicep curl', 'Arms'),

        -- Arm Exercises - Triceps
        ('Close-Grip Bench Press', 'Bench press with narrow grip for triceps', 'Arms'),
        ('Tricep Dips', 'Bodyweight or weighted tricep dips', 'Arms'),
        ('Overhead Tricep Extension', 'Dumbbell or cable overhead extension', 'Arms'),
        ('Tricep Pushdown', 'Cable tricep pushdown', 'Arms'),
        ('Skull Crushers', 'Lying barbell or dumbbell tricep extension', 'Arms'),
        ('Diamond Push-Ups', 'Close-grip push-ups for triceps', 'Arms'),

        -- Leg Exercises - Quadriceps
        ('Squat', 'Barbell back squat for overall leg development', 'Legs'),
        ('Front Squat', 'Barbell front squat targeting quads', 'Legs'),
        ('Leg Press', 'Machine leg press', 'Legs'),
        ('Leg Extension', 'Machine leg extension for quad isolation', 'Legs'),
        ('Bulgarian Split Squat', 'Single-leg squat variation', 'Legs'),
        ('Lunges', 'Walking or stationary lunges', 'Legs'),
        ('Goblet Squat', 'Dumbbell or kettlebell squat', 'Legs'),

        -- Leg Exercises - Hamstrings
        ('Romanian Deadlift', 'Deadlift variation for hamstrings', 'Legs'),
        ('Leg Curl', 'Machine leg curl for hamstring isolation', 'Legs'),
        ('Good Mornings', 'Barbell good mornings for hamstrings', 'Legs'),
        ('Glute Ham Raise', 'Bodyweight hamstring exercise', 'Legs'),

        -- Leg Exercises - Calves
        ('Standing Calf Raise', 'Standing calf raise on machine or with barbell', 'Legs'),
        ('Seated Calf Raise', 'Seated calf raise machine', 'Legs'),
        ('Calf Press', 'Calf press on leg press machine', 'Legs'),

        -- Core/Abs Exercises
        ('Plank', 'Isometric core exercise', 'Core'),
        ('Crunches', 'Basic abdominal crunches', 'Core'),
        ('Sit-Ups', 'Full sit-up movement', 'Core'),
        ('Leg Raises', 'Lying or hanging leg raises', 'Core'),
        ('Russian Twists', 'Seated rotational ab exercise', 'Core'),
        ('Cable Crunches', 'Kneeling cable crunches', 'Core'),
        ('Ab Wheel Rollout', 'Ab wheel exercise for core', 'Core'),
        ('Mountain Climbers', 'Dynamic core and cardio exercise', 'Core'),
        ('Bicycle Crunches', 'Alternating knee-to-elbow crunches', 'Core'),
        ('Dead Bug', 'Core stability exercise', 'Core'),

        -- Olympic Lifts
        ('Clean and Jerk', 'Olympic weightlifting movement', 'Olympic'),
        ('Snatch', 'Olympic weightlifting movement', 'Olympic'),
        ('Power Clean', 'Explosive pulling movement', 'Olympic'),
        ('Hang Clean', 'Clean variation from hang position', 'Olympic'),

        -- Cardio
        ('Running', 'Outdoor or treadmill running', 'Cardio'),
        ('Cycling', 'Stationary bike or outdoor cycling', 'Cardio'),
        ('Rowing', 'Rowing machine cardio', 'Cardio'),
        ('Jump Rope', 'Skipping rope cardio exercise', 'Cardio'),
        ('Burpees', 'Full body cardio exercise', 'Cardio'),
        ('Box Jumps', 'Plyometric box jump exercise', 'Cardio'),
        ('Battle Ropes', 'Heavy rope cardio and strength exercise', 'Cardio'),

        -- Full Body
        ('Kettlebell Swing', 'Hip hinge movement with kettlebell', 'Full Body'),
        ('Turkish Get-Up', 'Complex full body kettlebell movement', 'Full Body'),
        ('Thrusters', 'Squat to overhead press combination', 'Full Body'),
        ('Man Makers', 'Burpee with dumbbell row and press', 'Full Body'),
        ('Farmers Walk', 'Loaded carry exercise', 'Full Body');
        """,
        # "Down" SQL statement
        """
        DELETE FROM exercises WHERE exercise_name IN (
            'Bench Press', 'Incline Bench Press', 'Decline Bench Press', 'Dumbbell Bench Press',
            'Dumbbell Flyes', 'Cable Flyes', 'Push-Ups', 'Chest Dips', 'Pec Deck Machine',
            'Deadlift', 'Barbell Row', 'T-Bar Row', 'Dumbbell Row', 'Pull-Ups', 'Chin-Ups',
            'Lat Pulldown', 'Seated Cable Row', 'Face Pulls', 'Hyperextensions',
            'Overhead Press', 'Dumbbell Shoulder Press', 'Arnold Press', 'Lateral Raises',
            'Front Raises', 'Rear Delt Flyes', 'Upright Row', 'Shrugs', 'Cable Lateral Raises',
            'Barbell Curl', 'Dumbbell Curl', 'Hammer Curl', 'Preacher Curl', 'Cable Curl',
            'Concentration Curl', 'EZ-Bar Curl', 'Close-Grip Bench Press', 'Tricep Dips',
            'Overhead Tricep Extension', 'Tricep Pushdown', 'Skull Crushers', 'Diamond Push-Ups',
            'Squat', 'Front Squat', 'Leg Press', 'Leg Extension', 'Bulgarian Split Squat',
            'Lunges', 'Goblet Squat', 'Romanian Deadlift', 'Leg Curl', 'Good Mornings',
            'Glute Ham Raise', 'Standing Calf Raise', 'Seated Calf Raise', 'Calf Press',
            'Plank', 'Crunches', 'Sit-Ups', 'Leg Raises', 'Russian Twists', 'Cable Crunches',
            'Ab Wheel Rollout', 'Mountain Climbers', 'Bicycle Crunches', 'Dead Bug',
            'Clean and Jerk', 'Snatch', 'Power Clean', 'Hang Clean',
            'Running', 'Cycling', 'Rowing', 'Jump Rope', 'Burpees', 'Box Jumps', 'Battle Ropes',
            'Kettlebell Swing', 'Turkish Get-Up', 'Thrusters', 'Man Makers', 'Farmers Walk'
        );
        """,
    ],
]
