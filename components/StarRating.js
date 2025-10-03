import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const StarRating = ({ 
  rating = 0, 
  maxRating = 5, 
  size = 20, 
  color = '#FFD700', 
  onRatingChange = null,
  readonly = false 
}) => {
  const handleStarPress = (selectedRating) => {
    if (!readonly && onRatingChange) {
      onRatingChange(selectedRating);
    }
  };

  const renderStars = () => {
    const stars = [];
    
    for (let i = 1; i <= maxRating; i++) {
      const isFilled = i <= rating;
      
      stars.push(
        <TouchableOpacity
          key={i}
          style={styles.star}
          onPress={() => handleStarPress(i)}
          disabled={readonly}
        >
          <Ionicons
            name={isFilled ? 'star' : 'star-outline'}
            size={size}
            color={color}
          />
        </TouchableOpacity>
      );
    }
    
    return stars;
  };

  return (
    <View style={styles.container}>
      <View style={styles.starsContainer}>
        {renderStars()}
      </View>
      {!readonly && (
        <Text style={styles.ratingText}>
          {rating > 0 ? `${rating}/${maxRating}` : 'Toca para calificar'}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    marginHorizontal: 2,
  },
  ratingText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
});

export default StarRating;
