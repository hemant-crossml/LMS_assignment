from rest_framework import serializers
from books.models import Book, BookCopy, Author, Category, Publisher

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class PublisherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publisher
        fields = '__all__'

class BookCopySerializer(serializers.ModelSerializer):
    class Meta:
        model = BookCopy
        fields = '__all__'

class BookSerializer(serializers.ModelSerializer):
    authors = AuthorSerializer(many=True, read_only=True)
    category = CategorySerializer(read_only=True)
    publisher = PublisherSerializer(read_only=True)
    available_copies_count = serializers.IntegerField(read_only=True)
    total_copies_count = serializers.IntegerField(read_only=True)
    
    # Write fields
    author_ids = serializers.ListField(
        child=serializers.IntegerField(), write_only=True, required=False
    )
    category_id = serializers.IntegerField(write_only=True, required=False)
    publisher_id = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = Book
        fields = '__all__'

    def create(self, validated_data):
        author_ids = validated_data.pop('author_ids', [])
        book = Book.objects.create(**validated_data)
        if author_ids:
            book.authors.set(author_ids)
        return book

    def update(self, instance, validated_data):
        author_ids = validated_data.pop('author_ids', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        if author_ids is not None:
            instance.authors.set(author_ids)
        return instance

class BookListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views"""
    authors = serializers.StringRelatedField(many=True)
    category = serializers.StringRelatedField()
    available_copies_count = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Book
        fields = ['id', 'title', 'isbn', 'authors', 'category', 
                  'publication_year', 'cover_image', 'available_copies_count']