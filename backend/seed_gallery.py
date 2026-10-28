import os
from pathlib import Path

import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.conf import settings
from django.core.files import File

from restaurant.models import GalleryImage

src_dir = Path(settings.BASE_DIR).parent / 'frontend' / 'public' / 'images'
sources = [p for p in (src_dir / 'hero.avif', src_dir / 'intro.avif') if p.exists()]

items = [
    ('The NOIRÉ dining room, softly lit for the evening', 'interior'),
    ('A plated dish prepared by our kitchen', 'food'),
    ('Candlelit tables set for dinner service', 'dining'),
    ('Warm pendant lights above the main dining area', 'interior'),
    ('A signature course, plated to order', 'food'),
    ('The kitchen team at work during service', 'kitchen'),
]

if not sources:
    print('No photos found in', src_dir)
else:
    for i, (caption, category) in enumerate(items, start=1):
        src = sources[(i - 1) % len(sources)]
        obj, created = GalleryImage.objects.get_or_create(
            caption=caption,
            defaults={'category': category, 'display_order': i, 'is_active': True},
        )
        if created or not obj.image:
            with open(src, 'rb') as f:
                obj.image.save(f'demo-{i}{src.suffix}', File(f), save=True)
            print('Created: ' + caption)
        else:
            print('Already exists: ' + caption)
